"use client";

import { useMutation } from "@tanstack/react-query";
import { endRealtimeSession } from "../api/realtime-session.api";

export function useEndRealtimeSession() {
  return useMutation({
    mutationFn: (sessionId: string) => endRealtimeSession(sessionId),
  });
}
