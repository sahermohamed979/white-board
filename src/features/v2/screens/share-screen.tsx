"use client";

import { Loader } from "lucide-react";
import { CanvasSvgLayer } from "../../v1/components/canvas-svg-layer";
import { SelectionOverlay } from "../../v1/components/selection-overlay";
import ZoomUndoButtons from "../../v1/components/zoom-undo-buttons";
import { useBoardStore } from "../../v1/store/board-store";
import { usePersistedBoard } from "../../v1/hooks/use-persisted-board";
import { useKeyboardShortcuts } from "../../v1/hooks/use-keyboard-shortcuts";
import { useCanvasTransform } from "../../v1/hooks/use-canvas-transform";
import { useRef } from "react";
import { gridStyleMap } from "../../v1/constants/grid.constant";
import { cn } from "@/src/shared/lib/utils";
import { useRevalidateLink } from "../hooks/share-hook";
import Tools from "../../v1/components/tools";
import ErrorShare from "../components/error-share";

export default function ShareScreen({ token }: { token: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { isPanning, transform, screenToCanvas } = useCanvasTransform();
  const activeTool = useBoardStore((state) => state.activeTool);
  const { isHydrated } = usePersistedBoard();
  useKeyboardShortcuts();
  const revalidateLink = useRevalidateLink(token);
  const boardData = revalidateLink.data?.data;
  const viewportCenter = screenToCanvas(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  );
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
      <Tools viewportCenter={viewportCenter} readonly={true} />
      <div
        dir="ltr"
        className={cn("w-full h-full  touch-none", boardData?.backgroundColor)}
      >
        <CanvasSvgLayer
          ref={svgRef}
          readonly={true}
          background={gridStyle}
          elementsShared={boardData?.elements}
          canvasTransform={transform}
        >
          <SelectionOverlay scale={transform.scale} />
        </CanvasSvgLayer>
      </div>
      <ZoomUndoButtons scale={transform.scale} readonly={true} />
    </main>
  );
}
