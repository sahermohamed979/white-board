import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/src/features/v2/api/supabase-server";
import { createSessionRequestSchema } from "@/src/features/v3/realtime/schema/session.schema";
import type { ApiResponse } from "@/src/shared/types/response-types";
import type {
  RealtimeSession,
  RealtimeSessionRow,
} from "@/src/features/v3/realtime/types/session.types";
import {
  createOwnerCapability,
  OWNER_CAPABILITY_COOKIE,
} from "@/src/features/v3/realtime/api/owner-capability";

function errorResponse(
  message: string,
  code: number,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ status: false, message, code }, { status: code });
}

/**
 * POST /api/realtime/session
 *
 * Creates or refreshes a realtime collaboration session for a board.
 * Calls the `create_or_refresh_realtime_session` RPC via the service-role client.
 *
 * ⚠️ DEV ONLY: No board ownership verification — any client with a valid boardId
 * can create a session. Must be secured when auth is implemented (V3.24).
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<RealtimeSession>>> {
  // Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  // Validate with Zod
  const parsed = createSessionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Invalid request body", 400);
  }

  // Create server-side Supabase client (service role — never exposed to browser)
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (err) {
    console.error("Supabase client creation failed:", err);
    return errorResponse("Session service is not configured", 500);
  }

  // Call RPC
  const { data, error } = await supabase.rpc(
    "create_or_refresh_realtime_session",
    {
      p_board_id: parsed.data.boardId,
      p_board_data: parsed.data.board,
    },
  );

  if (error) {
    console.error("Supabase RPC error:", error);
    return errorResponse("Unable to create session", 500);
  }

  // The RPC returns a single row (not an array), but handle both shapes defensively
  const row = (Array.isArray(data) ? data[0] : data) as
    | Partial<RealtimeSessionRow>
    | null
    | undefined;

  if (!row || !row.id || !row.join_token || !row.expires_at) {
    return errorResponse("Unable to create session", 500);
  }

  // Convert expires_at from ISO string to Unix timestamp (ms)
  const expiresAt = Date.parse(row.expires_at);
  if (!Number.isFinite(expiresAt)) {
    return errorResponse("Unable to create session", 500);
  }

  // Map database row → client-facing payload (camelCase, no DB internals)
  const payload: RealtimeSession = {
    sessionId: row.id,
    boardId: parsed.data.boardId,
    joinToken: row.join_token,
    expiresAt,
    maxParticipants: row.max_participants ?? 5,
  };

  const response = NextResponse.json({
    status: true as const,
    payload,
  }) as NextResponse<ApiResponse<RealtimeSession>>;
  const ownerCapability = createOwnerCapability(payload.sessionId);

  if (ownerCapability) {
    response.cookies.set(OWNER_CAPABILITY_COOKIE, ownerCapability, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  return response;
}
