"use client";

import { useRef } from "react";
import { useBoardStore } from "../store/board-store";
import { getBoundingBox } from "../lib/bounding-box";

type ResizeState = {
  id: string;
  handle: number;
  startX: number;
  startY: number;
  startElementX: number;
  startElementY: number;
  startWidth: number;
  startHeight: number;
};

export function SelectionOverlay() {
  const resizeCursors = [
    "cursor-nwse-resize",
    "cursor-ns-resize",
    "cursor-nesw-resize",
    "cursor-ew-resize",
    "cursor-nwse-resize",
    "cursor-ns-resize",
    "cursor-nesw-resize",
    "cursor-ew-resize",
  ];
  const selectedIds = useBoardStore((s) => s.selectedIds);
  const elements = useBoardStore((s) => s.elements);
  const updateElement = useBoardStore((s) => s.updateElement);

  const resizeRef = useRef<ResizeState | null>(null);

  if (selectedIds.length === 0) return null;

  const selectedElements = elements.filter((el) => selectedIds.includes(el.id));

  if (selectedElements.length === 0) return null;

  const handlePointerDown = (
    e: React.PointerEvent<SVGRectElement>,
    el: (typeof selectedElements)[number],
    handle: number,
  ) => {
    e.stopPropagation();

    // حاليا الـ resize للعناصر اللي عندها x/y/width/height
    if (
      el.type !== "rectangle" &&
      el.type !== "circle" &&
      el.type !== "diamond" &&
      el.type !== "image"
    ) {
      return;
    }

    resizeRef.current = {
      id: el.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startElementX: el.x,
      startElementY: el.y,
      startWidth: el.width,
      startHeight: el.height,
    };

    if (e.currentTarget.isConnected && e.buttons !== 0) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // The pointer may have become inactive between the checks and capture.
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    const resize = resizeRef.current;

    if (!resize) return;

    const dx = e.clientX - resize.startX;
    const dy = e.clientY - resize.startY;

    let x = resize.startElementX;
    let y = resize.startElementY;

    let width = resize.startWidth;
    let height = resize.startHeight;

    // LEFT
    if (resize.handle === 0 || resize.handle === 6 || resize.handle === 7) {
      x = resize.startElementX + dx;
      width = resize.startWidth - dx;
    }

    // RIGHT
    if (resize.handle === 2 || resize.handle === 3 || resize.handle === 4) {
      width = resize.startWidth + dx;
    }

    // TOP
    if (resize.handle === 0 || resize.handle === 1 || resize.handle === 2) {
      y = resize.startElementY + dy;
      height = resize.startHeight - dy;
    }

    // BOTTOM
    if (resize.handle === 4 || resize.handle === 5 || resize.handle === 6) {
      height = resize.startHeight + dy;
    }

    const minSize = 5;

    if (width < minSize) {
      width = minSize;
      x = resize.startElementX + resize.startWidth - minSize;
    }

    if (height < minSize) {
      height = minSize;
      y = resize.startElementY + resize.startHeight - minSize;
    }

    updateElement(resize.id, {
      x,
      y,
      width,
      height,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGRectElement>) => {
    resizeRef.current = null;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
  };

  return (
    <g className="pointer-events-none">
      {selectedElements.map((el) => {
        const box = getBoundingBox(el);

        const padding = 6;

        const x = box.x - padding;
        const y = box.y - padding;

        const width = box.width + padding * 2;
        const height = box.height + padding * 2;

        const handleSize = 7;
        const half = handleSize / 2;

        const handles = [
          { x, y },
          { x: x + width / 2, y },
          { x: x + width, y },
          { x: x + width, y: y + height / 2 },
          { x: x + width, y: y + height },
          { x: x + width / 2, y: y + height },
          { x, y: y + height },
          { x, y: y + height / 2 },
        ];

        return (
          <g key={`selection-${el.id}`}>
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              pointerEvents="none"
            />

            {handles.map((h, i) => (
              <rect
                key={i}
                x={h.x - half}
                y={h.y - half}
                width={handleSize}
                height={handleSize}
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth={1.5}
                rx={1}
                pointerEvents="all"
                className={resizeCursors[i]}
                onPointerDown={(e) => handlePointerDown(e, el, i)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}
