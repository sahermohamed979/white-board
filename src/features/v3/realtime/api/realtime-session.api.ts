import type {
  JoinRealtimeSessionPayload,
  JoinRealtimeSessionResponse,
} from "../types/session.types";
import type { ApiResponse } from "@/src/shared/types/response-types";

/**
 * Fetches and validates a realtime session by its join token.
 * Calls GET /api/realtime/session/[token]
 */
export async function getRealtimeSession(
  token: string,
): Promise<JoinRealtimeSessionPayload> {
  const response = await fetch(
    `/api/realtime/session/${encodeURIComponent(token)}`,
  );
  const data: JoinRealtimeSessionResponse = await response.json();

  if (!data.status) {
    const error = new Error(data.message ?? "Failed to validate session");
    (error as Error & { code?: number }).code = data.code;
    throw error;
  }

  return data.payload;
}

/**
 * Ends a realtime collaboration session.
 * Calls POST /api/realtime/session/end
 */
export async function endRealtimeSession(
  sessionId: string,
): Promise<{ ended: boolean }> {
  const response = await fetch("/api/realtime/session/end", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });

  const data: ApiResponse<{ ended: boolean }> = await response.json();

  if (!data.status) {
    throw new Error(data.message ?? "Failed to end session");
  }

  return data.payload;
}
