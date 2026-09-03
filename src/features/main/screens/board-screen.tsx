"use client";

import { useRef, useState } from "react";
import { usePointerEvents } from "../hooks/use-pointer-events";
import { usePersistedBoard } from "../hooks/use-persisted-board";
import { useKeyboardShortcuts } from "../hooks/use-keyboard-shortcuts";
import { CanvasSvgLayer } from "../components/canvas-svg-layer";
import { SelectionOverlay } from "../components/selection-overlay";
import { TextEditorOverlay } from "../components/text-editor-overlay";
import { useCanvasTransform } from "../hooks/use-canvas-transform";
import { useBoardStore } from "../store/board-store";
import { cn } from "@/src/shared/lib/utils";
import SideDropDown from "../components/side-drop-down";
import Tools from "../components/tools";
import { Loader } from "lucide-react";
import ZoomUndoButtons from "../components/zoom-undo-buttons";

export function Board() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const exportContainerRef = useRef<HTMLDivElement | null>(null);

  const [textPlacement, setTextPlacement] = useState<[number, number] | null>(
    null,
  );
  const { isPanning, transform, screenToCanvas } = useCanvasTransform();
  const activeTool = useBoardStore((state) => state.activeTool);
  const backgroundColor = useBoardStore((state) => state.backgroundColor);
  const { isHydrated } = usePersistedBoard();

  usePersistedBoard();
  useKeyboardShortcuts();

  const { pointerEventsProps } = usePointerEvents(
    svgRef,
    (point) => setTextPlacement(point),
    screenToCanvas,
  );

  const viewportCenter = screenToCanvas(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  );

  if (!isHydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader className="animate-spin h-16 w-16 text-primary" />
      </div>
    );
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
      <Tools viewportCenter={viewportCenter} />
      <SideDropDown
        containerRef={exportContainerRef}
        backgroundColor={backgroundColor}
      />
      <div
        className={cn("w-full h-full", backgroundColor)}
        ref={exportContainerRef}
      >
        <TextEditorOverlay
          placement={textPlacement}
          onClose={() => setTextPlacement(null)}
        />

        <CanvasSvgLayer
          ref={svgRef}
          {...pointerEventsProps}
          canvasTransform={transform}
        >
          <SelectionOverlay />
        </CanvasSvgLayer>
      </div>
      <ZoomUndoButtons scale={transform.scale} />
    </main>
  );
}

export default Board;
