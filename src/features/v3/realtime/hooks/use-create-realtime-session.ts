"use client";

import { useMutation } from "@tanstack/react-query";

import type {
  CreateRealtimeSessionResponse,
  CreateRealtimeSessionVariables,
} from "@/src/features/v3/realtime/types/session.types";

export function useCreateRealtimeSession() {
  const createSessionMutation = useMutation<
    CreateRealtimeSessionResponse,
    Error,
    CreateRealtimeSessionVariables
  >({
    mutationFn: async ({ boardId, board }) => {
      const response = await fetch("/api/realtime/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId, board }),
      });

      const data: CreateRealtimeSessionResponse = await response.json();

      if (!data.status) {
        throw new Error(data.message ?? "Failed to create session");
      }

      return data;
    },
  });

  return createSessionMutation;
}
