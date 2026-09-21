import type { Element } from "@/src/features/v1/types/element.types";

/* ==============================================
   1. Realtime Presence Types
============================================== */

export interface CursorPosition {
  x: number; // WORLD coordinates
  y: number; // WORLD coordinates
}

export interface ParticipantPresence {
  participantId: string;
  color: string;
  cursor: CursorPosition | null;
  joinedAt: number;
  name?: string;
  isOwner?: boolean;
  style?: {
    strokeColor: string;
    strokeWidth: number;
  };
}

/* ==============================================
   2. Realtime Broadcast Operation Types
============================================== */

export interface ElementCreatePayload {
  operationId: string;
  boardId: string;
  participantId: string;
  timestamp: number;
  element: Element;
}

export interface ElementUpdatePayload {
  operationId: string;
  boardId: string;
  participantId: string;
  timestamp: number;
  element: Element;
}

export interface ElementDeletePayload {
  operationId: string;
  boardId: string;
  participantId: string;
  timestamp: number;
  elementId: string;
}

export interface SessionEndPayload {
  sessionId: string;
  timestamp: number;
}

/* ==============================================
   3. End Session Request / Response Types
============================================== */

export interface EndSessionRequest {
  sessionId: string;
}

export interface EndSessionResponse {
  status: boolean;
  message?: string;
}
