import type { ApiResponse } from "@/src/shared/types/response-types";
import type { Element } from "@/src/features/v1/types/element.types";

/* =========================
   Realtime Session Types
========================= */

/** Client-facing session data returned by the create/refresh session API */
export interface RealtimeSession {
  sessionId: string;
  boardId: string;
  joinToken: string;
  expiresAt: number; // Unix timestamp in milliseconds
  maxParticipants: number;
}

/** Variables passed to the create-session mutation */
export interface CreateRealtimeSessionVariables {
  boardId: string;
  board: {
    elements: Element[];
    backgroundColor: string;
    backgroundGrid: string;
  };
}

/** Typed API response for create/refresh session */
export type CreateRealtimeSessionResponse = ApiResponse<RealtimeSession>;

/* =========================
   Board Snapshot
========================= */

/** Initial snapshot of the board loaded upon joining */
export interface BoardSnapshot {
  id: string;
  name: string;
  elements: Element[];
  backgroundColor: string;
  backgroundGrid: string;
}

/* =========================
   Join Realtime Session
========================= */

/** Payload returned by GET /api/realtime/session/[token] */
export interface JoinRealtimeSessionPayload {
  sessionId: string;
  boardId: string;
  expiresAt: number; // Unix timestamp in milliseconds
  maxParticipants: number;
  participantColor: string;
  board: BoardSnapshot;
}

/** Typed API response for joining/validating a session */
export type JoinRealtimeSessionResponse = ApiResponse<JoinRealtimeSessionPayload>;

/* =========================
   Database Row (internal)
========================= */

/**
 * Shape of the row returned by the `create_or_refresh_realtime_session` RPC.
 * Used only inside the Route Handler — never exposed to the client.
 */
export interface RealtimeSessionRow {
  id: string;
  board_id: string;
  join_token: string;
  expires_at: string; // ISO timestamp string from Postgres
  max_participants: number;
  active: boolean;
  board_data: unknown;
  created_at: string;
}
