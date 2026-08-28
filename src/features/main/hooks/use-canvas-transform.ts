"use client";

import { useState, useCallback } from "react";
import { useGesture } from "@use-gesture/react";
import { useBoardStore } from "../store/board-store";
export type Transform = { x: number; y: number; scale: number };

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

export function useCanvasTransform() {
  const activeTool = useBoardStore((state) => state.activeTool);
  const [isPanning, setIsPanning] = useState(false);

  const [transform, setTransform] = useState<Transform>({
    x: 0,
    y: 0,
    scale: 1,
  });

  useGesture(
    {
      onWheel: ({ delta: [dx, dy], ctrlKey, altKey, shiftKey, event }) => {
        event.preventDefault();

        if (altKey) {
          setTransform((t) => ({ ...t, y: t.y - dy }));
        } else if (shiftKey) {
          setTransform((t) => ({ ...t, x: t.x - dy }));
        } else if (ctrlKey) {
          setTransform((t) => {
            const newScale = clamp(t.scale - dy * 0.001, 0.1, 5);
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            const scaleRatio = newScale / t.scale;

            return {
              scale: newScale,
              x: mouseX - (mouseX - t.x) * scaleRatio,
              y: mouseY - (mouseY - t.y) * scaleRatio,
            };
          });
        } else {
          setTransform((t) => ({ ...t, x: t.x - dx, y: t.y - dy }));
        }
      },
      onDragStart: () => {
        if (activeTool === "hand") {
          setIsPanning(true);
        }
      },
      onDrag: ({ delta: [dx, dy] }) => {
        if (activeTool !== "hand" && activeTool !== "select") return;
        if (activeTool === "hand") {
          setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
        }
      },
      onDragEnd: () => {
        setIsPanning(false);
      },
    },
    {
      target: typeof window !== "undefined" ? window : undefined,
      eventOptions: { passive: false },
    },
  );

  const screenToCanvas = useCallback(
    (screenX: number, screenY: number) => ({
      x: (screenX - transform.x) / transform.scale,
      y: (screenY - transform.y) / transform.scale,
    }),
    [transform],
  );

  return { isPanning, transform, screenToCanvas };
}
