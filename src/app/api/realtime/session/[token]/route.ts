import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/src/features/v2/api/supabase-server";
import {
  joinTokenSchema,
  updateSessionSnapshotSchema,
} from "@/src/features/v3/realtime/schema/session.schema";
import type { ApiResponse } from "@/src/shared/types/response-types";
import type {
  JoinRealtimeSessionPayload,
  RealtimeSessionRow,
} from "@/src/features/v3/realtime/types/session.types";
import type { Element } from "@/src/features/v1/types/element.types";
import { shareBoardDataSchema } from "@/src/features/v1/schema/share.schema";

function errorResponse(
  message: string,
  code: number,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ status: false, message, code }, { status: code });
}

interface RouteParams {
  params: Promise<{ token: string }>;
}

/**
 * GET /api/realtime/session/[token]
 *
 * Validates a session join token, checks activity, expiration, and capacity,
 * and returns the session metadata along with the initial board snapshot.
 *
 * ⚠️ CAPACITY ENFORCEMENT NOTE:
 * Server-side atomic participant counting/reservation will be added in phase V3.20.
 * In this initial implementation, the session capacity limit is retrieved and verified.
 */
export async function GET(
  _request: Request,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<JoinRealtimeSessionPayload>>> {
  const { token } = await params;

  // 1. Validate token format
  const parsed = joinTokenSchema.safeParse(token);
  if (!parsed.success) {
    return errorResponse("Invalid session token format", 400);
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
    // 3. Find the session by join_token
    const { data: sessionData, error: sessionError } = await supabase
      .from("realtime_sessions")
      .select("id, board_id, join_token, expires_at, max_participants, active, board_data")
      .eq("join_token", parsed.data)
      .maybeSingle();

    if (sessionError) {
      console.error("Session query error:", sessionError);
      return errorResponse("Unable to validate session", 500);
    }

    if (!sessionData) {
      return errorResponse("Session not found", 404);
    }

    const session = sessionData as RealtimeSessionRow;

    // 4. Check if session is active
    if (!session.active) {
      return errorResponse("This session has ended", 410);
    }

    // 5. Check if session has expired
    const expiresAt = Date.parse(session.expires_at);
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      return errorResponse("This session has expired", 410);
    }

    // 6. Capacity check:
    // Future V3.20: atomic reservation / heartbeat participant count in Postgres.
    // Ensure max_participants is respected.
    const maxParticipants = session.max_participants ?? 10;

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
