"use client";

import { useBoardStore } from "../store/board-store";
import { getBoundingBox } from "../lib/bounding-box";

export function SelectionOverlay() {
  const selectedIds = useBoardStore((s) => s.selectedIds);
  const elements = useBoardStore((s) => s.elements);

  if (selectedIds.length === 0) return null;

  const selectedElements = elements.filter((el) => selectedIds.includes(el.id));
  if (selectedElements.length === 0) return null;

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

        // 8 handle points: [top-left, top-mid, top-right, mid-right, bot-right, bot-mid, bot-left, mid-left]
        const handles = [
          { x: x, y: y },
          { x: x + width / 2, y: y },
          { x: x + width, y: y },
          { x: x + width, y: y + height / 2 },
          { x: x + width, y: y + height },
          { x: x + width / 2, y: y + height },
          { x: x, y: y + height },
          { x: x, y: y + height / 2 },
        ];

        return (
          <g key={`selection-${el.id}`}>
            {/* Dashed boundary box */}
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />

            {/* 8 resize/selection handles */}
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
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}
