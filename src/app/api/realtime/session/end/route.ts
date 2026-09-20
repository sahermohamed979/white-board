import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/src/features/v2/api/supabase-server";
import { endSessionRequestSchema } from "@/src/features/v3/realtime/schema/realtime-collaboration.schema";
import type { ApiResponse } from "@/src/shared/types/response-types";
import {
  isOwnerCapabilityValid,
  OWNER_CAPABILITY_COOKIE,
} from "@/src/features/v3/realtime/api/owner-capability";

function errorResponse(
  message: string,
  code: number,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ status: false, message, code }, { status: code });
}

/**
 * POST /api/realtime/session/end
 *
 * Marks the realtime session inactive in PostgreSQL.
 * Does NOT delete or modify the original board in the boards table.
 *
 * ⚠️ DEV ONLY: the capability cookie proves this browser created the session,
 * but it is not an authenticated user identity. Replace with auth.users owner_id
 * and an RLS/RPC check when authentication is available.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<{ ended: boolean }>>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const parsed = endSessionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("Invalid session ID", 400);
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (err) {
    console.error("Supabase client creation failed:", err);
    return errorResponse("Session service is not configured", 500);
  }

  try {
    // 1. Check if session exists and is active
    const { data: session, error: fetchError } = await supabase
      .from("realtime_sessions")
      .select("id, active, expires_at")
      .eq("id", parsed.data.sessionId)
      .maybeSingle();

    if (fetchError || !session) {
      return errorResponse("Session not found", 404);
    }

    const ownerCapability = request.cookies.get(OWNER_CAPABILITY_COOKIE)?.value;
    if (!isOwnerCapabilityValid(ownerCapability, parsed.data.sessionId)) {
      return errorResponse("Only the session owner can end this session", 403);
    }

    if (!session.active) {
      return errorResponse("Session has already ended", 410);
    }

    if (Date.parse(session.expires_at) <= Date.now()) {
      return errorResponse("Session has expired", 410);
    }

    // 2. Mark session as inactive
    const { error: updateError } = await supabase
      .from("realtime_sessions")
      .update({ active: false })
      .eq("id", parsed.data.sessionId);

    if (updateError) {
      console.error("Failed to end session in database:", updateError);
      return errorResponse("Unable to end session", 500);
    }

    return NextResponse.json({
      status: true,
      payload: { ended: true },
      message: "Session ended successfully",
    });
  } catch (err) {
    console.error("Unexpected error ending session:", err);
    return errorResponse("Unable to end session", 500);
  }
}
