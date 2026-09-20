"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Clock, Loader, AlertTriangle, Radio } from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/src/shared/lib/utils";

import { useRealtimeSession } from "../hooks/use-realtime-session";
import { useRealtimeChannel } from "../hooks/use-realtime-channel";
import { useRealtimePresence } from "../hooks/use-realtime-presence";
import { useRealtimeBoard } from "../hooks/use-realtime-board";
import { useEndRealtimeSession } from "../hooks/use-end-realtime-session";
import { RemoteCursorLayer } from "../components/remote-cursor-layer";
import { SessionHeader } from "../components/session-header";

import { CanvasSvgLayer } from "@/src/features/v1/components/canvas-svg-layer";
import { SelectionOverlay } from "@/src/features/v1/components/selection-overlay";
import {
  TextEditorOverlay,
  type TextEditorHandle,
} from "@/src/features/v1/components/text-editor-overlay";
import ZoomUndoButtons from "@/src/features/v1/components/zoom-undo-buttons";
import Tools from "@/src/features/v1/components/tools";
import SideDropDown from "@/src/features/v1/components/side-drop-down";
import { useCanvasTransform } from "@/src/features/v1/hooks/use-canvas-transform";
import { useKeyboardShortcuts } from "@/src/features/v1/hooks/use-keyboard-shortcuts";
import { usePointerEvents } from "@/src/features/v1/hooks/use-pointer-events";
import { useBoardStore } from "@/src/features/v1/store/board-store";
import { gridStyleMap } from "@/src/features/v1/constants/grid.constant";

export interface SessionScreenProps {
  token: string;
}

/** Format remaining milliseconds to MM:SS */
function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function SessionScreen({ token }: { token: string }) {
  const locale = useLocale();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const exportContainerRef = useRef<HTMLDivElement | null>(null);
  const textEditorRef = useRef<TextEditorHandle>(null);

  const [textPlacement, setTextPlacement] = useState<[number, number] | null>(
    null,
  );
  const [sessionEnded, setSessionEnded] = useState(false);

  // 1. Session Query (TanStack Query)
  const {
    data: sessionData,
    isPending,
    isError,
    error,
  } = useRealtimeSession(token);

  const boardId = sessionData?.boardId ?? "";
  const sessionId = sessionData?.sessionId ?? "";
  const boardSnapshot = sessionData?.board;

  // ⚠️ DEV ONLY: Check if current browser tab created this session
  const isOwner = useMemo(() => {
    if (typeof window === "undefined" || !sessionId) return false;
    return sessionStorage.getItem("sketchly_owned_session") === sessionId;
  }, [sessionId]);

  // 2. Realtime Channel Lifecycle
  const {
    status: channelStatus,
    channel,
    participantId,
    disconnect,
    registerPresenceListener,
    registerBroadcastListener,
  } = useRealtimeChannel(
    boardId,
    Boolean(sessionData && !sessionEnded),
  );

  // 3. Realtime Presence & Remote Cursors
  const {
    remoteParticipants,
    participantCount,
    currentParticipant,
    updateCursor,
    clearCursor,
  } = useRealtimePresence({
    channel,
    registerPresenceListener,
    participantId,
    isOwner,
    enabled: Boolean(channel),
    isSubscribed: channelStatus === "SUBSCRIBED",
  });

  // 4. Realtime Board Sync (Broadcast)
  const { loadInitialSnapshot, broadcastEndSession } = useRealtimeBoard({
    channel,
    registerBroadcastListener,
    boardId,
    sessionId,
    participantId,
    onSessionEnded: () => setSessionEnded(true),
    enabled: Boolean(channel) && !sessionEnded,
  });

  // 5. End Session Mutation
  const { mutate: endSessionMutation, isPending: isEndingSession } =
    useEndRealtimeSession();

  const handleEndSession = () => {
    if (!sessionId) return;
    endSessionMutation(sessionId, {
      onSuccess: async () => {
        await broadcastEndSession(sessionId);
        setSessionEnded(true);
      },
      onError: (err) => {
        console.error("Failed to end session:", err);
      },
    });
  };

  // 6. Canvas Transforms & Controls
  const {
    isPanning,
    viewportGroupRef,
    screenToCanvas,
    getViewportCenter,
    getScale,
    subscribe,
    getTransformSnapshot,
  } = useCanvasTransform();

  const activeTool = useBoardStore((state) => state.activeTool);
  useKeyboardShortcuts();

  // 7. Pointer Events for Board Interaction
  const { pointerEventsProps } = usePointerEvents(
    svgRef,
    (point) => {
      textEditorRef.current?.commitPending();
      setTextPlacement(point);
    },
    screenToCanvas,
  );

  // Intercept pointer move on canvas to update local cursor in Presence
  const handleCanvasPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    pointerEventsProps.onPointerMove(e);

    const svg = svgRef.current;
    if (svg) {
      const rect = svg.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const { x, y } = screenToCanvas(screenX, screenY);
      updateCursor(x, y);
    }
  };

  const handleCanvasPointerLeave = () => {
    clearCursor();
  };

  // 8. Safely load initial board snapshot into Zustand once on mount
  const hasLoadedSnapshotRef = useRef(false);
  useEffect(() => {
    if (!boardSnapshot?.elements || hasLoadedSnapshotRef.current) return;
    hasLoadedSnapshotRef.current = true;
    loadInitialSnapshot(boardSnapshot.elements);
  }, [boardSnapshot, loadInitialSnapshot]);

  // 9. Persist the session-only snapshot without affecting Broadcast operations.
  useEffect(() => {
    if (!sessionData || sessionEnded) return;

    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    const unsubscribe = useBoardStore.subscribe((state) => {
      if (saveTimer) clearTimeout(saveTimer);

      saveTimer = setTimeout(() => {
        void fetch(`/api/realtime/session/${encodeURIComponent(token)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            board: {
              elements: state.elements,
              backgroundColor: state.backgroundColor,
              backgroundGrid: state.backgroundGrid,
            },
          }),
        }).catch((error: unknown) => {
          console.error("Failed to save temporary session snapshot:", error);
        });
      }, 500);
    });

    return () => {
      if (saveTimer) clearTimeout(saveTimer);
      unsubscribe();
    };
  }, [sessionData, sessionEnded, token]);

  // 10. Countdown Timer for UI
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionData?.expiresAt) return;

    const updateTimer = () => {
      const remaining = sessionData.expiresAt - Date.now();
      setTimeLeft(remaining > 0 ? remaining : 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [sessionData?.expiresAt]);

  const isExpired = timeLeft !== null && timeLeft <= 0;

  useEffect(() => {
    if (!sessionEnded && !isExpired) return;
    disconnect();
    clearCursor();
  }, [sessionEnded, isExpired, disconnect, clearCursor]);

  // --- STATE: LOADING ---
  if (isPending) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <Loader className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Joining collaborative session...
        </p>
      </div>
    );
  }

  // --- STATE: SESSION ENDED ---
  if (sessionEnded) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-background text-foreground p-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Radio className="size-12 opacity-50" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h1 className="text-3xl font-bold tracking-tight">Session Ended</h1>
          <p className="text-sm text-muted-foreground">
            This collaborative session has been ended. Your drawings and changes
            remain saved.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow hover:opacity-90 transition-all"
        >
          Return to Board
        </Link>
      </div>
    );
  }

  // --- STATE: EXPIRED ---
  if (isExpired) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-background text-foreground p-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Clock className="size-12 opacity-50" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h1 className="text-3xl font-bold tracking-tight">Session Expired</h1>
          <p className="text-sm text-muted-foreground">
            The 30-minute collaboration window has ended.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow hover:opacity-90 transition-all"
        >
          Return to Board
        </Link>
      </div>
    );
  }

  // --- STATE: ERROR (Invalid token / 404 / 410) ---
  if (isError) {
    const rawMessage = error?.message ?? "Unable to join session";
    const errorCode = (error as Error & { code?: number })?.code;
    const isLinkExpired =
      rawMessage.toLowerCase().includes("expir") || errorCode === 410;

    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-background text-foreground p-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted">
          {isLinkExpired ? (
            <Clock className="h-12 w-12 text-muted-foreground" />
          ) : (
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h1 className="text-3xl font-bold tracking-tight">
            {isLinkExpired ? "Session Expired" : "Session Unavailable"}
          </h1>
          <p className="text-sm text-muted-foreground">{rawMessage}</p>
        </div>
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow hover:opacity-90 transition-all"
        >
          Go to Sketchly
        </Link>
      </div>
    );
  }

  const gridStyle = gridStyleMap[boardSnapshot?.backgroundGrid ?? "none"] ?? {};

  // --- STATE: ACTIVE COLLABORATION ---
  return (
    <main
      className={cn(
        "relative h-screen w-screen overflow-hidden",
        activeTool === "hand"
          ? isPanning
            ? "cursor-grabbing"
            : "cursor-grab"
          : "cursor-default",
      )}
    >
      <h1 className="sr-only">
        {boardSnapshot?.name ?? "Sketchly Collaborative Session"}
      </h1>

      {/* 1. Realtime Session Header Toolbar */}
      <SessionHeader
        channelStatus={channelStatus}
        participantCount={participantCount}
        participants={remoteParticipants}
        currentParticipant={currentParticipant}
        timeLeftFormatted={
          timeLeft !== null ? formatTimeRemaining(timeLeft) : null
        }
        isOwner={isOwner}
        joinToken={token}
        locale={locale}
        onEndSession={handleEndSession}
        isEndingSession={isEndingSession}
      />

      {/* 2. Isolated Remote Cursors Layer */}
      <RemoteCursorLayer
        participants={remoteParticipants}
        subscribe={subscribe}
        getTransformSnapshot={getTransformSnapshot}
      />

      {/* 3. Whiteboard Tools & Controls */}
      <Tools getViewportCenter={getViewportCenter} readonly={false} />

      <SideDropDown
        containerRef={exportContainerRef}
        backgroundColor={boardSnapshot?.backgroundColor}
        readonly={false}
      />

      {/* 4. Canvas & Interactive SVG Layer */}
      <div
        dir="ltr"
        className={cn(
          "w-full h-full touch-none",
          boardSnapshot?.backgroundColor,
        )}
        style={gridStyle}
        ref={exportContainerRef}
      >
        <TextEditorOverlay
          ref={textEditorRef}
          placement={textPlacement}
          onClose={() => setTextPlacement(null)}
        />

        <CanvasSvgLayer
          ref={svgRef}
          readonly={false}
          viewportGroupRef={viewportGroupRef}
          onPointerDown={pointerEventsProps.onPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={pointerEventsProps.onPointerUp}
          onPointerCancel={pointerEventsProps.onPointerCancel}
          onPointerLeave={handleCanvasPointerLeave}
        >
          <SelectionOverlay getScale={getScale} />
        </CanvasSvgLayer>

        <ZoomUndoButtons
          subscribe={subscribe}
          getTransformSnapshot={getTransformSnapshot}
        />
      </div>
    </main>
  );
}

export default SessionScreen;
