"use client";

import { useRef, useState } from "react";
import { usePointerEvents } from "../hooks/use-pointer-events";
import { usePersistedBoard } from "../hooks/use-persisted-board";
import { useKeyboardShortcuts } from "../hooks/use-keyboard-shortcuts";
import { CanvasSvgLayer } from "./canvas-svg-layer";
import { SelectionOverlay } from "./selection-overlay";
import { TextEditorOverlay } from "./text-editor-overlay";
import { useCanvasTransform } from "../hooks/use-canvas-transform";
import { useBoardStore } from "../store/board-store";
import { cn } from "@/src/shared/lib/utils";
import SideDropDown from "./side-drop-down";

export function Board() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const exportContainerRef = useRef<HTMLDivElement | null>(null); // ← جديد

  const [textPlacement, setTextPlacement] = useState<[number, number] | null>(
    null,
  );
  const { isPanning, transform, screenToCanvas } = useCanvasTransform(); // جديد
  const activeTool = useBoardStore((state) => state.activeTool);
  const backgroundColor = useBoardStore((state) => state.backgroundColor);
  // Initialize Dexie persistence & Keyboard shortcuts
  usePersistedBoard();
  useKeyboardShortcuts();

  // Pointer events hook for canvas drawing & selection
  const { pointerEventsProps } = usePointerEvents(
    svgRef,
    (point) => setTextPlacement(point),
    screenToCanvas,
  );

  return (
    <main
      className={cn(
        "relative h-screen w-screen overflow-hidden ",

        activeTool === "hand"
          ? isPanning
            ? "cursor-grabbing"
            : "cursor-grab"
          : "cursor-default",
      )}
    >
      <SideDropDown
        containerRef={exportContainerRef}
        backgroundColor={backgroundColor}
      />

      <div
        className={cn("w-full h-full", backgroundColor)}
        ref={exportContainerRef}
      >
        {/* Floating Text Editor when Text tool is active */}
        <TextEditorOverlay
          placement={textPlacement}
          onClose={() => setTextPlacement(null)}
        />

        {/* Interactive SVG Canvas Layer */}
        <CanvasSvgLayer
          ref={svgRef}
          {...pointerEventsProps}
          canvasTransform={transform}
        >
          {" "}
          <SelectionOverlay />
        </CanvasSvgLayer>
      </div>
    </main>
  );
}

export default Board;
