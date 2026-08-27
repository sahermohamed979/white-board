"use client";

import React, { useRef, useState } from "react";
import { usePointerEvents } from "../hooks/use-pointer-events";
import { usePersistedBoard } from "../hooks/use-persisted-board";
import { useKeyboardShortcuts } from "../hooks/use-keyboard-shortcuts";
import Tools from "./tools";
import { CanvasSvgLayer } from "./canvas-svg-layer";
import { SelectionOverlay } from "./selection-overlay";
import { StylePanel } from "./style-panel";
import { TextEditorOverlay } from "./text-editor-overlay";

export function Board() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [textPlacement, setTextPlacement] = useState<[number, number] | null>(null);

  // Initialize Dexie persistence & Keyboard shortcuts
  usePersistedBoard();
  useKeyboardShortcuts();

  // Pointer events hook for canvas drawing & selection
  const { pointerEventsProps } = usePointerEvents(svgRef, (point) => {
    setTextPlacement(point);
  });

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white">
      {/* Top Floating Toolbar */}
      <Tools />

      {/* Floating Style Panel for Selection */}
      <StylePanel />

      {/* Floating Text Editor when Text tool is active */}
      <TextEditorOverlay
        placement={textPlacement}
        onClose={() => setTextPlacement(null)}
      />

      {/* Interactive SVG Canvas Layer */}
      <CanvasSvgLayer ref={svgRef} {...pointerEventsProps}>
        <SelectionOverlay />
      </CanvasSvgLayer>
    </main>
  );
}

export default Board;
