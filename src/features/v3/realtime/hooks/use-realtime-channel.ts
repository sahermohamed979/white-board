"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/src/features/v3/realtime/lib/supabase-client";

export type ChannelStatus =
  | "INITIALIZING"
  | REALTIME_SUBSCRIBE_STATES
  | "CLOSED";

export type PresenceState = Record<string, unknown[]>;
export type PresenceListener = (state: PresenceState) => void;
export type BroadcastEvent =
  | "element:create"
  | "element:update"
  | "element:delete"
  | "session:end";
export type BroadcastListener = (payload: unknown) => void;

interface TestMessage {
  type: "test";
  message: string;
  senderId: string;
  timestamp: number;
}

/**
 * Manages the Supabase RealtimeChannel lifecycle for a specific board.
 * Sets up broadcast (self: false) and presence (key: participantId).
 */
export function useRealtimeChannel(boardId: string, enabled = true) {
  const [status, setStatus] = useState<ChannelStatus>("INITIALIZING");
  const [channelInstance, setChannelInstance] =
    useState<RealtimeChannel | null>(null);

  // Channel kept in ref to avoid re-renders and stale closures
  const channelRef = useRef<RealtimeChannel | null>(null);
  const presenceListenersRef = useRef(new Set<PresenceListener>());
  const broadcastListenersRef = useRef(
    new Map<BroadcastEvent, Set<BroadcastListener>>(),
  );

  // Participant ID generated once per browser session
  const [participantId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `p-${Date.now().toString(36)}`,
  );

  const disconnect = useCallback(() => {
    const channel = channelRef.current;
    if (!channel) return;

    void getSupabaseBrowserClient().removeChannel(channel);
    channelRef.current = null;
    setChannelInstance(null);
    setStatus("CLOSED");
  }, []);

  useEffect(() => {
    // Skip if running during SSR or if boardId is missing
    if (typeof window === "undefined" || !boardId || !enabled) return;

    const supabase = getSupabaseBrowserClient();

    const channel = supabase.channel(`board:${boardId}`, {
      config: {
        broadcast: {
          self: false,
        },
        presence: {
          key: participantId,
        },
      },
    });

    channel.on(
      "broadcast",
      { event: "test" },
      (message: { payload: TestMessage }) => {
        console.log("[Sketchly Realtime] Received test:", message.payload);
      },
    );

    const dispatchPresence = () => {
      const state = channel.presenceState() as PresenceState;
      for (const listener of presenceListenersRef.current) {
        listener(state);
      }
    };

    channel.on("presence", { event: "sync" }, dispatchPresence);
    channel.on("presence", { event: "join" }, dispatchPresence);
    channel.on("presence", { event: "leave" }, dispatchPresence);

    const broadcastEvents: BroadcastEvent[] = [
      "element:create",
      "element:update",
      "element:delete",
      "session:end",
    ];

    for (const event of broadcastEvents) {
      channel.on(
        "broadcast",
        { event },
        ({ payload }: { payload: unknown }) => {
          for (const listener of broadcastListenersRef.current.get(event) ??
            []) {
            listener(payload);
          }
        },
      );
    }

    channelRef.current = channel;
    channel.subscribe(
      (channelStatus: REALTIME_SUBSCRIBE_STATES, err?: Error) => {
        setStatus(channelStatus);

        if (err) {
          console.error("[Sketchly Realtime] Subscribe error:", err);
        }
      },
    );
    setChannelInstance(channel);

    return () => {
      disconnect();
    };
  }, [boardId, enabled, participantId, disconnect]);

  const registerPresenceListener = useCallback((listener: PresenceListener) => {
    presenceListenersRef.current.add(listener);
    const channel = channelRef.current;
    if (channel) {
      listener(channel.presenceState() as PresenceState);
    }

    return () => {
      presenceListenersRef.current.delete(listener);
    };
  }, []);

  const registerBroadcastListener = useCallback(
    (event: BroadcastEvent, listener: BroadcastListener) => {
      const listeners = broadcastListenersRef.current.get(event) ?? new Set();
      listeners.add(listener);
      broadcastListenersRef.current.set(event, listeners);

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          broadcastListenersRef.current.delete(event);
        }
      };
    },
    [],
  );

  const sendTestMessage = useCallback(() => {
    if (!channelRef.current || status !== "SUBSCRIBED") return;

    const payload: TestMessage = {
      type: "test",
      message: "Hello from Sketchly",
      senderId: participantId,
      timestamp: Date.now(),
    };

    channelRef.current.send({
      type: "broadcast",
      event: "test",
      payload,
    });
  }, [status, participantId]);

  return {
    status,
    channel: channelInstance,
    participantId,
    disconnect,
    registerPresenceListener,
    registerBroadcastListener,
    sendTestMessage,
  } as const;
}
