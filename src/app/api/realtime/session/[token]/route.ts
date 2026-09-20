import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/src/features/v2/api/supabase-server";
import { joinTokenSchema } from "@/src/features/v3/realtime/schema/session.schema";
import type { ApiResponse } from "@/src/shared/types/response-types";
import type {
  JoinRealtimeSessionPayload,
  RealtimeSessionRow,
} from "@/src/features/v3/realtime/types/session.types";
import type { Element } from "@/src/features/v1/types/element.types";

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
      .select("id, board_id, join_token, expires_at, max_participants, active")
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

    // 7. Fetch the associated board snapshot
    const { data: boardData, error: boardError } = await supabase
      .from("boards")
      .select("id, name, data")
      .eq("id", session.board_id)
      .maybeSingle();

    if (boardError || !boardData) {
      console.error("Board query error:", boardError);
      return errorResponse("Associated board not found", 404);
    }

    // 8. Safely parse board elements and styles from the authoritative server data
    let elements: Element[] = [];
    let backgroundColor = "bg-background";
    let backgroundGrid = "none";

    if (boardData.data) {
      if (Array.isArray(boardData.data)) {
        elements = boardData.data as Element[];
      } else if (typeof boardData.data === "object" && boardData.data !== null) {
        const raw = boardData.data as Record<string, unknown>;
        if (Array.isArray(raw.elements)) {
          elements = raw.elements as Element[];
        }
        if (typeof raw.backgroundColor === "string") {
          backgroundColor = raw.backgroundColor;
        }
        if (typeof raw.backgroundGrid === "string") {
          backgroundGrid = raw.backgroundGrid;
        }
      }
    }

    // 9. Return clean client payload
    const payload: JoinRealtimeSessionPayload = {
      sessionId: session.id,
      boardId: session.board_id,
      expiresAt,
      maxParticipants,
      board: {
        id: boardData.id,
        name: boardData.name ?? "Collaborative Board",
        elements,
        backgroundColor,
        backgroundGrid,
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
