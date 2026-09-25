import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/src/features/v2/api/supabase-server";
import {
  joinTokenSchema,
  joinSessionSearchSchema,
  updateSessionSnapshotSchema,
} from "@/src/features/v3/realtime/schema/session.schema";
import type { ApiResponse } from "@/src/shared/types/response-types";
import type {
  JoinRealtimeSessionPayload,
  RealtimeSessionRow,
} from "@/src/features/v3/realtime/types/session.types";
import type { Element } from "@/src/features/v1/types/element.types";
import { shareBoardDataSchema } from "@/src/features/v1/schema/share.schema";
import {
  getOwnerCapabilityCookieName,
  isOwnerCapabilityValid,
  OWNER_CAPABILITY_COOKIE,
} from "@/src/features/v3/realtime/api/owner-capability";

function errorResponse(
  message: string,
  code: number,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ status: false, message, code }, { status: code });
}

interface RouteParams {
  params: Promise<{ token: string }>;
}

const PARTICIPANT_COLORS = [
  "#EF4444",
  "#3B82F6",
  "#22C55E",
  "#A855F7",
  "#F97316",
] as const;

function getFallbackParticipantColor(participantId: string): string {
  let hash = 0;

  for (const character of participantId) {
    hash = (hash << 5) - hash + character.charCodeAt(0);
    hash |= 0;
  }

  return PARTICIPANT_COLORS[Math.abs(hash) % PARTICIPANT_COLORS.length];
}

/**
 * GET /api/realtime/session/[token]
 *
 * Validates a session join token, checks activity, expiration, and capacity,
 * and returns the session metadata along with the initial board snapshot.
 *
 * The join_realtime_session RPC atomically reserves a persistent participant slot.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<JoinRealtimeSessionPayload>>> {
  const { token } = await params;

  // 1. Validate token format
  const parsed = joinTokenSchema.safeParse(token);
  if (!parsed.success) {
    return errorResponse("Invalid session token format", 400);
  }

  const participant = joinSessionSearchSchema.safeParse({
    participantId: request.nextUrl.searchParams.get("participantId"),
    name: request.nextUrl.searchParams.get("name"),
  });
  if (!participant.success) {
    return errorResponse("A valid participant identity and name are required", 400);
  }

  // 2. Initialize server Supabase client (service role — never exposed to client)
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (err) {
    console.error("Supabase client creation failed:", err);
    return errorResponse("Session service is not configured", 500);
  }

  try {
    // Atomically reserve this participant's persistent slot.
    const { data: sessionData, error: sessionError } = await supabase.rpc(
      "join_realtime_session",
      {
        p_join_token: parsed.data,
        p_participant_id: participant.data.participantId,
        p_display_name: participant.data.name,
      },
    );

    let session = (Array.isArray(sessionData) ? sessionData[0] : sessionData) as
      | (RealtimeSessionRow & { participant_color: string })
      | null;

    if (sessionError?.code === "PGRST202") {
      // Compatibility while the participant-slot migration is being deployed.
      const { data: fallbackSession, error: fallbackError } = await supabase
        .from("realtime_sessions")
        .select("id, board_id, join_token, expires_at, max_participants, active, board_data, created_at")
        .eq("join_token", parsed.data)
        .maybeSingle();

      if (fallbackError) {
        console.error("Session compatibility lookup failed:", fallbackError);
        return errorResponse("Unable to join session", 500);
      }

      if (!fallbackSession) {
        return errorResponse("Session not found", 404);
      }

      session = {
        ...(fallbackSession as RealtimeSessionRow),
        participant_color: getFallbackParticipantColor(participant.data.participantId),
      };
    } else if (sessionError) {
      const message = sessionError.message;
      if (message.includes("SESSION_FULL")) return errorResponse("Session is full", 409);
      if (message.includes("SESSION_ENDED")) return errorResponse("This session has ended", 410);
      if (message.includes("SESSION_EXPIRED")) return errorResponse("This session has expired", 410);
      if (message.includes("SESSION_NOT_FOUND")) return errorResponse("Session not found", 404);
      console.error("Session join RPC error:", sessionError);
      return errorResponse("Unable to join session", 500);
    }

    if (!session) {
      return errorResponse("Session not found", 404);
    }

    // Session expiration remains server-authoritative.
    const expiresAt = Date.parse(session.expires_at);
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      return errorResponse("This session has expired", 410);
    }

    const maxParticipants = Math.min(session.max_participants ?? 5, 5);
    const ownerCapability =
      request.cookies.get(getOwnerCapabilityCookieName(session.id))?.value ??
      request.cookies.get(OWNER_CAPABILITY_COOKIE)?.value;
    const isOwner = isOwnerCapabilityValid(ownerCapability, session.id);

    // Session-only snapshot; this data is removed with the session record.
    const boardSnapshot = shareBoardDataSchema.safeParse(session.board_data);
    if (!boardSnapshot.success) {
      console.error("Invalid temporary session snapshot:", boardSnapshot.error);
      return errorResponse("Session data is invalid", 500);
    }

    // Return clean client payload
    const payload: JoinRealtimeSessionPayload = {
      sessionId: session.id,
      boardId: session.board_id,
      expiresAt,
      maxParticipants,
      participantColor: session.participant_color,
      isOwner,
      board: {
        id: session.board_id,
        name: "Collaborative Board",
        elements: boardSnapshot.data.elements as Element[],
        backgroundColor: boardSnapshot.data.backgroundColor ?? "bg-background",
        backgroundGrid: boardSnapshot.data.backgroundGrid ?? "none",
      },
    };

    return NextResponse.json({
      status: true,
      payload,
    });
  } catch (err) {
    console.error("Session join unexpected error:", err);
    return errorResponse("Unable to validate session", 500);
  }
}

/**
 * Stores the latest board snapshot only for the lifetime of this session.
 * `POST /api/realtime/session/end` deletes this row and its snapshot.
 */
export async function PATCH(
  request: Request,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<{ saved: boolean }>>> {
  const { token } = await params;
  const parsedToken = joinTokenSchema.safeParse(token);
  if (!parsedToken.success) {
    return errorResponse("Invalid session token format", 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const parsedBody = updateSessionSnapshotSchema.safeParse(body);
  if (!parsedBody.success) {
    return errorResponse("Invalid session data", 400);
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    console.error("Supabase client creation failed:", error);
    return errorResponse("Session service is not configured", 500);
  }

  const now = new Date().toISOString();
  const { data: updatedSession, error } = await supabase
    .from("realtime_sessions")
    .update({ board_data: parsedBody.data.board })
    .eq("join_token", parsedToken.data)
    .eq("active", true)
    .gt("expires_at", now)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to save temporary session snapshot:", error);
    return errorResponse("Unable to save session data", 500);
  }

  if (!updatedSession) {
    return errorResponse("Session has ended or expired", 410);
  }

  return NextResponse.json({ status: true, payload: { saved: true } });
}
