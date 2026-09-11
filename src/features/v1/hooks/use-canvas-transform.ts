"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useGesture } from "@use-gesture/react";

import { useBoardStore } from "../store/board-store";

export type Transform = { x: number; y: number; scale: number };

const INITIAL_TRANSFORM: Transform = { x: 0, y: 0, scale: 1 };
const MIN_SCALE = 0.1;
const MAX_SCALE = 5;

const clamp = (val: number, min: number, max: number): number =>
  Math.min(Math.max(val, min), max);

type TransformListener = () => void;

/**
 * Keeps pan/zoom off the React render path: mutates a ref + SVG attribute,
 * and only notifies UI subscribers (zoom %) on the next animation frame.
 */
export function useCanvasTransform() {
  const activeTool = useBoardStore((state) => state.activeTool);
  const activeToolRef = useRef(activeTool);

  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  const transformRef = useRef<Transform>({ ...INITIAL_TRANSFORM });
  const viewportGroupRef = useRef<SVGGElement | null>(null);
  const listenersRef = useRef(new Set<TransformListener>());
  const notifyRafRef = useRef<number | null>(null);

  const [isPanning, setIsPanning] = useState(false);

  const subscribe = useCallback((listener: TransformListener) => {
    listenersRef.current.add(listener);

    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const getTransformSnapshot = useCallback(
    (): Transform => transformRef.current,
    [],
  );

  const notifyListeners = useCallback(() => {
    if (notifyRafRef.current !== null) return;

    notifyRafRef.current = requestAnimationFrame(() => {
      notifyRafRef.current = null;
      listenersRef.current.forEach((listener) => listener());
    });
  }, []);

  const applyTransform = useCallback(
    (next: Transform) => {
      transformRef.current = next;

      const group = viewportGroupRef.current;

      if (group) {
        group.setAttribute(
          "transform",
          `translate(${next.x} ${next.y}) scale(${next.scale})`,
        );
      }

      notifyListeners();
    },
    [notifyListeners],
  );

  useEffect(() => {
    return () => {
      if (notifyRafRef.current !== null) {
        cancelAnimationFrame(notifyRafRef.current);
      }
    };
  }, []);

  useGesture(
    {
      onWheel: ({ delta: [dx, dy], ctrlKey, altKey, shiftKey, event }) => {
        event.preventDefault();

        const t = transformRef.current;

        if (altKey) {
          applyTransform({ ...t, y: t.y - dy });
          return;
        }

        if (shiftKey) {
          applyTransform({ ...t, x: t.x - dx });
          return;
        }

        if (ctrlKey) {
          const newScale = clamp(t.scale - dy * 0.001, MIN_SCALE, MAX_SCALE);

          if (newScale === t.scale) return;

          const mouseX = event.clientX;
          const mouseY = event.clientY;
          const scaleRatio = newScale / t.scale;

          applyTransform({
            scale: newScale,
            x: mouseX - (mouseX - t.x) * scaleRatio,
            y: mouseY - (mouseY - t.y) * scaleRatio,
          });
          return;
        }

        applyTransform({
          ...t,
          x: t.x - dx,
          y: t.y - dy,
        });
      },

      onPinch: ({
        offset: [pinchScale],
        origin: [originX, originY],
        first,
        memo,
      }) => {
        if (first) {
          return { ...transformRef.current };
        }

        const initial = memo as Transform;
        const newScale = clamp(
          initial.scale * pinchScale,
          MIN_SCALE,
          MAX_SCALE,
        );
        const scaleRatio = newScale / initial.scale;

        applyTransform({
          scale: newScale,
          x: originX - (originX - initial.x) * scaleRatio,
          y: originY - (originY - initial.y) * scaleRatio,
        });

        return initial;
      },

      onDrag: ({ delta: [dx, dy], touches, first, last }) => {
        if (touches > 1) return;
        if (activeToolRef.current !== "hand") return;

        if (first) setIsPanning(true);
        if (last) setIsPanning(false);

        const t = transformRef.current;

        applyTransform({
          ...t,
          x: t.x + dx,
          y: t.y + dy,
        });
      },
    },
    {
      target: typeof window !== "undefined" ? window : undefined,
      eventOptions: {
        passive: false,
      },
      pinch: {
        scaleBounds: { min: MIN_SCALE, max: MAX_SCALE },
        rubberband: true,
      },
    },
  );

  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    const t = transformRef.current;

    return {
      x: (screenX - t.x) / t.scale,
      y: (screenY - t.y) / t.scale,
    };
  }, []);

  const getViewportCenter = useCallback(() => {
    if (typeof window === "undefined") {
      return screenToCanvas(0, 0);
    }

    return screenToCanvas(window.innerWidth / 2, window.innerHeight / 2);
  }, [screenToCanvas]);

  const getScale = useCallback((): number => transformRef.current.scale, []);

  return {
    isPanning,
    viewportGroupRef,
    screenToCanvas,
    getViewportCenter,
    getScale,
    subscribe,
    getTransformSnapshot,
  };
}

/** Subscribe only the zoom % label — does not re-render the board. */
export function useTransformScale(
  subscribe: (listener: TransformListener) => () => void,
  getTransformSnapshot: () => Transform,
): number {
  return useSyncExternalStore(
    subscribe,
    () => getTransformSnapshot().scale,
    () => INITIAL_TRANSFORM.scale,
  );
}
