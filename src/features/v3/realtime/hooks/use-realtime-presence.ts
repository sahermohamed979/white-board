"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { PresenceState } from "./use-realtime-channel";
import type {
  CursorPosition,
  ParticipantPresence,
} from "../types/realtime-collaboration.types";
import { participantPresenceSchema } from "../schema/realtime-collaboration.schema";
import { useBoardStore } from "@/src/features/v1/store/board-store";

export const PARTICIPANT_COLORS = [
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#22C55E", // Green
  "#A855F7", // Purple
  "#F97316", // Orange
] as const;

/** Deterministic stable color per participantId */
export function getParticipantColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PARTICIPANT_COLORS.length;
  return PARTICIPANT_COLORS[index];
}

interface UseRealtimePresenceOptions {
  channel: RealtimeChannel | null;
  registerPresenceListener: (
    listener: (state: PresenceState) => void,
  ) => () => void;
  participantId: string;
  color: string;
  isOwner?: boolean;
  name?: string;
  enabled?: boolean;
  isSubscribed: boolean;
}

export function useRealtimePresence({
  channel,
  registerPresenceListener,
  participantId,
  color,
  isOwner = false,
  name,
  enabled = true,
  isSubscribed,
}: UseRealtimePresenceOptions) {
  const [presenceMap, setPresenceMap] = useState<
    Record<string, ParticipantPresence[]>
  >({});

  const [joinedAt] = useState(() => Date.now());
  const strokeColor = useBoardStore((state) => state.strokeColor);
  const strokeWidth = useBoardStore((state) => state.strokeWidth);

  // Local cursor state for rAF throttling
  const latestCursorRef = useRef<CursorPosition | null>(null);
  const lastTrackedCursorRef = useRef<CursorPosition | null>(null);
  const lastTrackedTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const flushCursorUpdateRef = useRef<() => void>(() => undefined);

  // Current presence payload
  const currentPresence = useMemo<ParticipantPresence>(
    () => ({
      participantId,
      color,
      cursor: null,
      joinedAt,
      name: name || (isOwner ? "Owner" : "Guest"),
      isOwner,
      style: { strokeColor, strokeWidth },
    }),
    [participantId, color, joinedAt, name, isOwner, strokeColor, strokeWidth],
  );

  // Presence
  useEffect(() => {
    if (!channel || !enabled) return;

    const unregisterPresenceListener = registerPresenceListener((state) => {
      const validPresenceMap: Record<string, ParticipantPresence[]> = {};

      for (const [key, presences] of Object.entries(state)) {
        const validPresences: ParticipantPresence[] = [];

        for (const presence of presences) {
          const parsed = participantPresenceSchema.safeParse(presence);
          if (!parsed.success) {
            console.error("[Sketchly Presence] Invalid presence payload:", parsed.error);
            continue;
          }

          validPresences.push(parsed.data);
        }

        if (validPresences.length > 0) validPresenceMap[key] = validPresences;
      }

      setPresenceMap(validPresenceMap);
    });

    return () => {
      unregisterPresenceListener();
      channel.untrack().catch(() => {});
    };
  }, [channel, enabled, registerPresenceListener]);

  useEffect(() => {
    if (!channel || !enabled || !isSubscribed) return;

    channel.track(currentPresence).catch((err) => {
      console.error("[Sketchly Presence] Initial track failed:", err);
    });
  }, [channel, enabled, isSubscribed, currentPresence]);

  // 2. Throttled cursor publishing using requestAnimationFrame (~25-30 fps)
  const flushCursorUpdate = useCallback(() => {
    if (!channel || !enabled || !isSubscribed) return;

    const now = performance.now();
    // Throttle to ~35ms (~28 updates/sec)
    if (now - lastTrackedTimeRef.current < 35) {
      rafIdRef.current = requestAnimationFrame(() =>
        flushCursorUpdateRef.current(),
      );
      return;
    }

    const latest = latestCursorRef.current;
    const last = lastTrackedCursorRef.current;

    const hasChanged =
      (latest === null && last !== null) ||
      (latest !== null && last === null) ||
      (latest !== null &&
        last !== null &&
        (latest.x !== last.x || latest.y !== last.y));

    if (hasChanged) {
      lastTrackedCursorRef.current = latest;
      lastTrackedTimeRef.current = now;

      channel
        .track({
          ...currentPresence,
          cursor: latest,
        })
        .catch(() => {
          // Silent presence errors to avoid spamming
        });
    }

    rafIdRef.current = null;
  }, [channel, enabled, isSubscribed, currentPresence]);

  useEffect(() => {
    flushCursorUpdateRef.current = flushCursorUpdate;
  }, [flushCursorUpdate]);

  const updateCursor = useCallback((worldX: number, worldY: number) => {
    latestCursorRef.current = { x: Math.round(worldX), y: Math.round(worldY) };

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() =>
        flushCursorUpdateRef.current(),
      );
    }
  }, []);

  const clearCursor = useCallback(() => {
    latestCursorRef.current = null;
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() =>
        flushCursorUpdateRef.current(),
      );
    }
  }, []);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // 3. Derived remote participants (excluding current participant)
  const remoteParticipants = useMemo(() => {
    const list: ParticipantPresence[] = [];
    for (const [key, presences] of Object.entries(presenceMap)) {
      if (key !== participantId && presences && presences.length > 0) {
        // Use the latest presence entry
        list.push(presences[presences.length - 1]);
      }
    }
    return list;
  }, [presenceMap, participantId]);

  // Total connected participants count (including self)
  const participantCount = useMemo(() => {
    return Math.max(1, Object.keys(presenceMap).length);
  }, [presenceMap]);

  return {
    remoteParticipants,
    participantCount,
    currentParticipant: currentPresence,
    updateCursor,
    clearCursor,
  };
}
