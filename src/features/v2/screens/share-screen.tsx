"use client";

import { useRef } from "react";
import { Loader } from "lucide-react";

import { cn } from "@/src/shared/lib/utils";

import { CanvasSvgLayer } from "../../v1/components/canvas-svg-layer";
import { SelectionOverlay } from "../../v1/components/selection-overlay";
import ZoomUndoButtons from "../../v1/components/zoom-undo-buttons";
import { useBoardStore } from "../../v1/store/board-store";
import { usePersistedBoard } from "../../v1/hooks/use-persisted-board";
import { useKeyboardShortcuts } from "../../v1/hooks/use-keyboard-shortcuts";
import { useCanvasTransform } from "../../v1/hooks/use-canvas-transform";
import { gridStyleMap } from "../../v1/constants/grid.constant";
import Tools from "../../v1/components/tools";
import { useRevalidateLink } from "../hooks/share-hook";
import ErrorShare from "../components/error-share";

export default function ShareScreen({ token }: { token: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const {
    isPanning,
    viewportGroupRef,
    getViewportCenter,
    getScale,
    subscribe,
    getTransformSnapshot,
  } = useCanvasTransform();

  const activeTool = useBoardStore((state) => state.activeTool);
  const { isHydrated } = usePersistedBoard();
  useKeyboardShortcuts();
  const revalidateLink = useRevalidateLink(token);
  const boardData = revalidateLink.data?.data;
  const gridStyle = gridStyleMap[boardData?.backgroundGrid ?? "none"] ?? {};

  // Loading
  if (!isHydrated || revalidateLink.isPending) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader className="animate-spin h-16 w-16 text-primary" />
      </div>
    );
  }

  // Error — invalid token, expired link, etc.
  if (revalidateLink.isError) {
    const message =
      revalidateLink.error?.message ??
      "This share link is no longer available.";
    const isExpired = message.toLowerCase().includes("expir");
    return <ErrorShare isExpired={isExpired} message={message} />;
  }

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
        Sketchly — Interactive Virtual Whiteboard & Sketching App
      </h1>
      <Tools getViewportCenter={getViewportCenter} readonly={true} />
      <div
        dir="ltr"
        className={cn("w-full h-full  touch-none", boardData?.backgroundColor)}
        style={gridStyle}
      >
        <CanvasSvgLayer
          ref={svgRef}
          readonly={true}
          elementsShared={boardData?.elements}
          viewportGroupRef={viewportGroupRef}
        >
          <SelectionOverlay getScale={getScale} />
        </CanvasSvgLayer>
      </div>
      <ZoomUndoButtons
        subscribe={subscribe}
        getTransformSnapshot={getTransformSnapshot}
        readonly={true}
      />
    </main>
  );
}
