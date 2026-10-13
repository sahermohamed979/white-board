"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Element } from "@/src/features/v1/types/element.types";
import { useBoardStore } from "@/src/features/v1/store/board-store";
import {
  deleteElementsFromDb,
  saveAllElements,
} from "@/src/features/v1/db/board-db";
import {
  elementCreateEventSchema,
  elementUpdateEventSchema,
  elementDeleteEventSchema,
  sessionEndEventSchema,
  drawingEndEventSchema,
  drawingStreamEventSchema,
} from "../schema/realtime-collaboration.schema";
import type {
  ElementCreatePayload,
  ElementUpdatePayload,
  ElementDeletePayload,
} from "../types/realtime-collaboration.types";
import type { BroadcastEvent, BroadcastListener } from "./use-realtime-channel";

const MAX_TRACKED_OPERATIONS = 1000;

interface UseRealtimeBoardOptions {
  channel: RealtimeChannel | null;
  registerBroadcastListener: (
    event: BroadcastEvent,
    listener: BroadcastListener,
  ) => () => void;
  boardId: string;
  sessionId: string;
  participantId: string;
  onSessionEnded?: () => void;
  enabled?: boolean;
}

export function useRealtimeBoard({
  channel,
  registerBroadcastListener,
  boardId,
  sessionId,
  participantId,
  onSessionEnded,
  enabled = true,
}: UseRealtimeBoardOptions) {
  const [remoteDrawingElements, setRemoteDrawingElements] = useState<Element[]>([]);
  // Bounded set for duplicate operation protection
  const processedOperationIdsRef = useRef<Set<string>>(new Set());
  const operationHistoryRef = useRef<string[]>([]);

  // Flag to avoid infinite loops: remote operations must NOT be rebroadcast as local
  const isApplyingRemoteRef = useRef(false);

  // Track element timestamps for Last-Write-Wins (LWW) conflict strategy
  const elementTimestampsRef = useRef<Map<string, number>>(new Map());

  // Store actions
  const addElement = useBoardStore((s) => s.addElement);
  const updateElement = useBoardStore((s) => s.updateElement);
  const deleteElements = useBoardStore((s) => s.deleteElements);
  const setElements = useBoardStore((s) => s.setElements);

  const isValidEventContext = useCallback(
    (eventBoardId: string, eventParticipantId: string) =>
      eventBoardId === boardId && eventParticipantId !== participantId,
    [boardId, participantId],
  );

  const isOperationProcessed = useCallback((operationId: string): boolean => {
    return processedOperationIdsRef.current.has(operationId);
  }, []);

  const markOperationProcessed = useCallback((operationId: string) => {
    if (processedOperationIdsRef.current.has(operationId)) return;

    processedOperationIdsRef.current.add(operationId);
    operationHistoryRef.current.push(operationId);

    // Evict oldest if exceeding capacity
    if (operationHistoryRef.current.length > MAX_TRACKED_OPERATIONS) {
      const oldest = operationHistoryRef.current.shift();
      if (oldest) {
        processedOperationIdsRef.current.delete(oldest);
      }
    }
  }, []);

  // 1. Broadcast functions for local actions
  const broadcastCreateElement = useCallback(
    (element: Element) => {
      if (!channel) return;

      const operationId = crypto.randomUUID();
      const timestamp = Date.now();

      markOperationProcessed(operationId);
      elementTimestampsRef.current.set(element.id, timestamp);

      const payload: ElementCreatePayload = {
        operationId,
        boardId,
        participantId,
        timestamp,
        element,
      };

      channel.send({
        type: "broadcast",
        event: "element:create",
        payload,
      });
    },
    [channel, boardId, participantId, markOperationProcessed],
  );

  const broadcastUpdateElement = useCallback(
    (element: Element) => {
      if (!channel) return;

      const operationId = crypto.randomUUID();
      const timestamp = Date.now();

      markOperationProcessed(operationId);
      elementTimestampsRef.current.set(element.id, timestamp);

      const payload: ElementUpdatePayload = {
        operationId,
        boardId,
        participantId,
        timestamp,
        element,
      };

      channel.send({
        type: "broadcast",
        event: "element:update",
        payload,
      });
    },
    [channel, boardId, participantId, markOperationProcessed],
  );

  const broadcastDeleteElement = useCallback(
    (elementId: string) => {
      if (!channel) return;

      const operationId = crypto.randomUUID();
      const timestamp = Date.now();

      markOperationProcessed(operationId);
      elementTimestampsRef.current.set(elementId, timestamp);

      const payload: ElementDeletePayload = {
        operationId,
        boardId,
        participantId,
        timestamp,
        elementId,
      };

      channel.send({
        type: "broadcast",
        event: "element:delete",
        payload,
      });
    },
    [channel, boardId, participantId, markOperationProcessed],
  );

  const broadcastDrawingStream = useCallback(
    (element: Element) => {
      if (!channel || !enabled) return;

      void channel.send({
        type: "broadcast",
        event: "drawing:stream",
        payload: { boardId, participantId, timestamp: Date.now(), element },
      });
    },
    [boardId, channel, enabled, participantId],
  );

  const broadcastDrawingEnd = useCallback(
    (elementId: string) => {
      if (!channel || !enabled) return;

      void channel.send({
        type: "broadcast",
        event: "drawing:end",
        payload: { boardId, participantId, timestamp: Date.now(), elementId },
      });
    },
    [boardId, channel, enabled, participantId],
  );

  // 2. Subscribe to incoming Realtime Broadcast events
  useEffect(() => {
    if (!channel || !enabled) return;

    // --- ELEMENT CREATE ---
    const handleCreate = (payload: unknown) => {
      const parsed = elementCreateEventSchema.safeParse(payload);
      if (!parsed.success) {
        console.error(
          "[Sketchly Realtime] Invalid element:create payload:",
          parsed.error,
        );
        return;
      }

      const data: ElementCreatePayload = parsed.data;

      if (!isValidEventContext(data.boardId, data.participantId)) return;

      // Duplicate check
      if (isOperationProcessed(data.operationId)) return;
      markOperationProcessed(data.operationId);

      const previousTimestamp =
        elementTimestampsRef.current.get(data.element.id) ?? 0;
      if (data.timestamp < previousTimestamp) return;

      // Record timestamp for LWW
      elementTimestampsRef.current.set(data.element.id, data.timestamp);

      // Check if element already exists locally before adding
      const currentElements = useBoardStore.getState().elements;
      const exists = currentElements.some((el) => el.id === data.element.id);
      if (!exists) {
        isApplyingRemoteRef.current = true;
        try {
          addElement(data.element as Element);
          void saveAllElements(useBoardStore.getState().elements).catch(
            (error: unknown) => {
              console.error(
                "[Sketchly Realtime] Failed to persist remote create:",
                error,
              );
            },
          );
        } finally {
          isApplyingRemoteRef.current = false;
        }
      }
    };

    // --- ELEMENT UPDATE ---
    const handleUpdate = (payload: unknown) => {
      const parsed = elementUpdateEventSchema.safeParse(payload);
      if (!parsed.success) {
        console.error(
          "[Sketchly Realtime] Invalid element:update payload:",
          parsed.error,
        );
        return;
      }

      const data: ElementUpdatePayload = parsed.data;

      if (!isValidEventContext(data.boardId, data.participantId)) return;

      // Duplicate check
      if (isOperationProcessed(data.operationId)) return;
      markOperationProcessed(data.operationId);

      // Conflict check: Last Write Wins
      const prevTimestamp =
        elementTimestampsRef.current.get(data.element.id) ?? 0;
      if (data.timestamp < prevTimestamp) {
        return; // Discard stale update
      }

      elementTimestampsRef.current.set(data.element.id, data.timestamp);

      isApplyingRemoteRef.current = true;
      try {
        updateElement(data.element.id, data.element as Element);
        void saveAllElements(useBoardStore.getState().elements).catch(
          (error: unknown) => {
            console.error(
              "[Sketchly Realtime] Failed to persist remote update:",
              error,
            );
          },
        );
      } finally {
        isApplyingRemoteRef.current = false;
      }
    };

    // --- ELEMENT DELETE ---
    const handleDelete = (payload: unknown) => {
      const parsed = elementDeleteEventSchema.safeParse(payload);
      if (!parsed.success) {
        console.error(
          "[Sketchly Realtime] Invalid element:delete payload:",
          parsed.error,
        );
        return;
      }

      const data: ElementDeletePayload = parsed.data;

      if (!isValidEventContext(data.boardId, data.participantId)) return;

      // Duplicate check
      if (isOperationProcessed(data.operationId)) return;
      markOperationProcessed(data.operationId);

      const previousTimestamp =
        elementTimestampsRef.current.get(data.elementId) ?? 0;
      if (data.timestamp < previousTimestamp) return;

      elementTimestampsRef.current.set(data.elementId, data.timestamp);

      isApplyingRemoteRef.current = true;
      try {
        deleteElements([data.elementId]);
        void deleteElementsFromDb([data.elementId]).catch((error: unknown) => {
          console.error(
            "[Sketchly Realtime] Failed to persist remote delete:",
            error,
          );
        });
      } finally {
        isApplyingRemoteRef.current = false;
      }
    };

    // --- SESSION END ---
    const handleSessionEnd = (payload: unknown) => {
      const parsed = sessionEndEventSchema.safeParse(payload);
      if (!parsed.success) {
        console.error(
          "[Sketchly Realtime] Invalid session:end payload:",
          parsed.error,
        );
        return;
      }

      if (parsed.data.sessionId !== sessionId) return;

      onSessionEnded?.();
    };

    const handleDrawingStream = (payload: unknown) => {
      const parsed = drawingStreamEventSchema.safeParse(payload);
      if (!parsed.success) {
        console.error("[Sketchly Realtime] Invalid drawing:stream payload:", parsed.error);
        return;
      }

      const data = parsed.data;
      if (!isValidEventContext(data.boardId, data.participantId)) return;

      setRemoteDrawingElements((current) => [
        ...current.filter((element) => element.id !== data.element.id),
        data.element as Element,
      ]);
    };

    const handleDrawingEnd = (payload: unknown) => {
      const parsed = drawingEndEventSchema.safeParse(payload);
      if (!parsed.success) {
        console.error("[Sketchly Realtime] Invalid drawing:end payload:", parsed.error);
        return;
      }

      const data = parsed.data;
      if (!isValidEventContext(data.boardId, data.participantId)) return;
      setRemoteDrawingElements((current) =>
        current.filter((element) => element.id !== data.elementId),
      );
    };

    const unregisterListeners = [
      registerBroadcastListener("element:create", handleCreate),
      registerBroadcastListener("element:update", handleUpdate),
      registerBroadcastListener("element:delete", handleDelete),
      registerBroadcastListener("session:end", handleSessionEnd),
      registerBroadcastListener("drawing:stream", handleDrawingStream),
      registerBroadcastListener("drawing:end", handleDrawingEnd),
    ];

    return () => {
      for (const unregister of unregisterListeners) unregister();
    };
  }, [
    channel,
    enabled,
    addElement,
    updateElement,
    deleteElements,
    onSessionEnded,
    isOperationProcessed,
    markOperationProcessed,
    isValidEventContext,
    sessionId,
    registerBroadcastListener,
  ]);

  // 3. Auto-broadcast local changes from Zustand store
  useEffect(() => {
    if (!channel || !enabled) return;

    let previousElements = useBoardStore.getState().elements;

    const unsubscribe = useBoardStore.subscribe((state) => {
      // If the change was triggered by a remote operation, do NOT rebroadcast
      if (isApplyingRemoteRef.current) {
        previousElements = state.elements;
        return;
      }

      if (state.elements === previousElements) return;

      const prevMap = new Map(previousElements.map((el) => [el.id, el]));
      const currentMap = new Map(state.elements.map((el) => [el.id, el]));

      // Detect newly added elements
      for (const el of state.elements) {
        if (!prevMap.has(el.id)) {
          broadcastCreateElement(el);
        }
      }

      // Detect deleted elements
      for (const prevEl of previousElements) {
        if (!currentMap.has(prevEl.id)) {
          broadcastDeleteElement(prevEl.id);
        }
      }

      // Detect updated elements
      for (const el of state.elements) {
        const prevEl = prevMap.get(el.id);
        if (prevEl && prevEl !== el) {
          broadcastUpdateElement(el);
        }
      }

      previousElements = state.elements;

      void saveAllElements(state.elements).catch((error: unknown) => {
        console.error("[Sketchly Realtime] Failed to persist board:", error);
      });
    });

    return unsubscribe;
  }, [
    channel,
    enabled,
    broadcastCreateElement,
    broadcastUpdateElement,
    broadcastDeleteElement,
    broadcastDrawingStream,
    broadcastDrawingEnd,
  ]);

  // Method to safely load initial snapshot without triggering local broadcast
  const loadInitialSnapshot = useCallback(
    (elements: Element[]) => {
      isApplyingRemoteRef.current = true;
      try {
        setElements(elements);
      } finally {
        isApplyingRemoteRef.current = false;
      }
    },
    [setElements],
  );

  const broadcastEndSession = useCallback(
    async (endedSessionId: string): Promise<void> => {
      if (!channel || !enabled) return;

      await channel.send({
        type: "broadcast",
        event: "session:end",
        payload: { sessionId: endedSessionId, timestamp: Date.now() },
      });
    },
    [channel, enabled],
  );

  return {
    broadcastCreateElement,
    broadcastUpdateElement,
    broadcastDeleteElement,
    broadcastDrawingStream,
    broadcastDrawingEnd,
    broadcastEndSession,
    loadInitialSnapshot,
    remoteDrawingElements,
  };
}
