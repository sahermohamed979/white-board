"use client";

import { useQuery } from "@tanstack/react-query";
import { getRealtimeSession } from "../api/realtime-session.api";

/**
 * Hook to validate and load a realtime session using TanStack Query.
 * Does NOT store the RealtimeChannel or presence state.
 */
export function useRealtimeSession(
  token: string,
  participantId: string | null,
  name: string | null,
) {
  return useQuery({
    queryKey: ["realtime-session", token, participantId],
    queryFn: () => getRealtimeSession(token, participantId!, name!),
    enabled: Boolean(token && participantId && name),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
