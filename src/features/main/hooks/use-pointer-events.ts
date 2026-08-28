"use client";

import { useCallback, useRef } from "react";
import { useBoardStore } from "../store/board-store";
import { generateId } from "../lib/id";
import { isPointInElement } from "../lib/hit-test";
import type { Element, Point } from "../types/element.types";

interface DragOffset {
  id: string;
  initialElement: Element;
}

export function usePointerEvents(
  svgRef: React.RefObject<SVGSVGElement | null>,
  onTextPlacement?: (point: [number, number]) => void,
  screenToCanvas: (x: number, y: number) => { x: number; y: number } = (
    x,
    y,
  ) => ({ x, y }),
) {
  // Store state & actions
  const activeTool = useBoardStore((s) => s.activeTool);
  const strokeColor = useBoardStore((s) => s.strokeColor);
  const fillColor = useBoardStore((s) => s.fillColor);
  const strokeWidth = useBoardStore((s) => s.strokeWidth);
  const selectedIds = useBoardStore((s) => s.selectedIds);
  const addElement = useBoardStore((s) => s.addElement);
  const setCurrentElement = useBoardStore((s) => s.setCurrentElement);
  const setSelectedIds = useBoardStore((s) => s.setSelectedIds);
  const updateElement = useBoardStore((s) => s.updateElement);
  const deleteElements = useBoardStore((s) => s.deleteElements);

  // Interaction tracking refs
  const isPointerDownRef = useRef(false);
  const startPointRef = useRef<Point | null>(null);
  const freehandPointsRef = useRef<Point[]>([]);
  const dragOffsetsRef = useRef<DragOffset[]>([]);
  const dragOriginRef = useRef<[number, number] | null>(null);

  // Convert client coordinates to SVG canvas space
  const getCoordinates = useCallback(
    (e: React.PointerEvent<SVGSVGElement>): Point => {
      const svg = svgRef.current;
      if (!svg) {
        return [e.clientX, e.clientY, e.pressure || 0.5];
      }
      const rect = svg.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const { x, y } = screenToCanvas(screenX, screenY); // ← التحويل الوحيد المطلوب
      return [x, y, e.pressure > 0 ? e.pressure : 0.5];
    },
    [svgRef, screenToCanvas],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const point = getCoordinates(e);
      if (activeTool === "hand") {
        return;
      }
      // Text tool opens editor at clicked location without pointer capture
      if (activeTool === "text") {
        onTextPlacement?.([point[0], point[1]]);
        return;
      }

      // Capture pointer for drawing & selection dragging
      if (e.currentTarget.isConnected && e.buttons !== 0) {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // The pointer may have become inactive between the checks and capture.
        }
      }

      isPointerDownRef.current = true;
      startPointRef.current = point;

      const currentElements = useBoardStore.getState().elements;

      switch (activeTool) {
        case "pen": {
          freehandPointsRef.current = [point];
          const newEl: Element = {
            id: generateId(),
            type: "freehand",
            points: [point],
            color: strokeColor,
            size: strokeWidth * 3,
            strokeColor,
            strokeWidth,
          };
          setCurrentElement(newEl);
          break;
        }
        case "diamond": {
          const newEl: Element = {
            id: generateId(),
            type: "diamond",
            x: point[0],
            y: point[1],
            width: 0,
            height: 0,
            strokeColor,
            fillColor,
            strokeWidth,
          };
          setCurrentElement(newEl);
          break;
        }
        case "straightLine": {
          const newEl: Element = {
            id: generateId(),
            type: "straightLine",
            x1: point[0],
            y1: point[1],
            x2: point[0],
            y2: point[1],
            strokeColor,
            strokeWidth,
          };

          setCurrentElement(newEl);
          break;
        }
        case "rectangle": {
          const newEl: Element = {
            id: generateId(),
            type: "rectangle",
            x: point[0],
            y: point[1],
            width: 0,
            height: 0,
            strokeColor,
            fillColor,
            strokeWidth,
          };
          setCurrentElement(newEl);
          break;
        }

        case "circle": {
          const newEl: Element = {
            id: generateId(),
            type: "circle",
            x: point[0],
            y: point[1],
            width: 0,
            height: 0,
            strokeColor,
            fillColor,
            strokeWidth,
          };
          setCurrentElement(newEl);
          break;
        }

        case "arrow": {
          const newEl: Element = {
            id: generateId(),
            type: "arrow",
            points: [point, point],
            strokeColor,
            strokeWidth,
          };
          setCurrentElement(newEl);
          break;
        }

        case "select": {
          // Reverse order to hit test topmost elements first
          let hitElement: Element | null = null;
          for (let i = currentElements.length - 1; i >= 0; i--) {
            if (isPointInElement(point, currentElements[i])) {
              hitElement = currentElements[i];
              break;
            }
          }

          if (hitElement) {
            const isAlreadySelected = selectedIds.includes(hitElement.id);
            const targetIds = isAlreadySelected ? selectedIds : [hitElement.id];
            setSelectedIds(targetIds);

            // Record initial positions for dragging
            dragOriginRef.current = [point[0], point[1]];
            dragOffsetsRef.current = currentElements
              .filter((el) => targetIds.includes(el.id))
              .map((el) => ({
                id: el.id,
                initialElement: JSON.parse(JSON.stringify(el)),
              }));
          } else {
            setSelectedIds([]);
            dragOffsetsRef.current = [];
            dragOriginRef.current = null;
          }
          break;
        }

        case "eraser": {
          const toDelete: string[] = [];
          for (const el of currentElements) {
            if (isPointInElement(point, el, 12)) {
              toDelete.push(el.id);
            }
          }
          if (toDelete.length > 0) {
            deleteElements(toDelete);
          }
          break;
        }
      }
    },
    [
      activeTool,
      strokeColor,
      fillColor,
      strokeWidth,
      selectedIds,
      getCoordinates,
      setCurrentElement,
      setSelectedIds,
      deleteElements,
      onTextPlacement,
    ],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isPointerDownRef.current || activeTool === "text") return;
      const point = getCoordinates(e);

      switch (activeTool) {
        case "pen": {
          freehandPointsRef.current.push(point);
          const current = useBoardStore.getState().currentElement;
          if (current && current.type === "freehand") {
            setCurrentElement({
              ...current,
              points: [...freehandPointsRef.current],
            });
          }
          break;
        }

        case "rectangle":

        case "diamond":
        case "circle": {
          const start = startPointRef.current;
          if (!start) return;

          const x = Math.min(start[0], point[0]);
          const y = Math.min(start[1], point[1]);
          const width = Math.abs(point[0] - start[0]);
          const height = Math.abs(point[1] - start[1]);

          const current = useBoardStore.getState().currentElement;
          if (
            current &&
            (current.type === "rectangle" ||
              current.type === "circle" ||
              current.type === "diamond")
          ) {
            setCurrentElement({
              ...current,
              x,
              y,
              width,
              height,
            });
          }
          break;
        }
        case "straightLine": {
          const start = startPointRef.current;
          if (!start) return;

          const current = useBoardStore.getState().currentElement;

          if (current && current.type === "straightLine") {
            setCurrentElement({
              ...current,
              x1: start[0],
              y1: start[1],
              x2: point[0],
              y2: point[1],
            });
          }

          break;
        }

        case "arrow": {
          const start = startPointRef.current;
          if (!start) return;

          const current = useBoardStore.getState().currentElement;
          if (current && current.type === "arrow") {
            setCurrentElement({
              ...current,
              points: [start, point],
            });
          }
          break;
        }

        case "select": {
          if (!dragOriginRef.current || dragOffsetsRef.current.length === 0)
            return;
          const [origX, origY] = dragOriginRef.current;
          const dx = point[0] - origX;
          const dy = point[1] - origY;

          for (const item of dragOffsetsRef.current) {
            const initial = item.initialElement;
            if (
              initial.type === "rectangle" ||
              initial.type === "circle" ||
              initial.type === "diamond" ||
              initial.type === "text"
            ) {
              updateElement(item.id, {
                x: initial.x + dx,
                y: initial.y + dy,
              });
            } else if (initial.type === "arrow") {
              const [p1, p2] = initial.points;
              updateElement(item.id, {
                points: [
                  [p1[0] + dx, p1[1] + dy, p1[2]],
                  [p2[0] + dx, p2[1] + dy, p2[2]],
                ],
              });
            } else if (initial.type === "freehand") {
              const shiftedPoints = initial.points.map(
                ([px, py, pr]) => [px + dx, py + dy, pr] as Point,
              );
              updateElement(item.id, { points: shiftedPoints });
            } else if (initial.type === "straightLine") {
              const { x1, y1, x2, y2 } = initial;
              updateElement(item.id, {
                x1: x1 + dx,
                y1: y1 + dy,
                x2: x2 + dx,
                y2: y2 + dy,
              });
            }
          }
          break;
        }

        case "eraser": {
          const currentElements = useBoardStore.getState().elements;
          const toDelete: string[] = [];
          for (const el of currentElements) {
            if (isPointInElement(point, el, 12)) {
              toDelete.push(el.id);
            }
          }
          if (toDelete.length > 0) {
            deleteElements(toDelete);
          }
          break;
        }
      }
    },
    [
      activeTool,
      getCoordinates,
      setCurrentElement,
      updateElement,
      deleteElements,
    ],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!isPointerDownRef.current || activeTool === "text") return;
      isPointerDownRef.current = false;

      // Release pointer capture
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore InvalidPointerId
      }

      const current = useBoardStore.getState().currentElement;
      if (current) {
        // Validate minimum size to avoid phantom elements
        let isValid = true;
        if (current.type === "rectangle" || current.type === "circle") {
          isValid = current.width > 2 || current.height > 2;
        } else if (current.type === "arrow") {
          const [p1, p2] = current.points;
          isValid = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) > 4;
        } else if (current.type === "freehand") {
          isValid = current.points.length > 0;
        } else if (current.type === "straightLine") {
          const { x1, y1, x2, y2 } = current;
          isValid = Math.hypot(x2 - x1, y2 - y1) > 2;
        }

        if (isValid) {
          addElement(current);
        }
        setCurrentElement(null);
      }

      startPointRef.current = null;
      freehandPointsRef.current = [];
      dragOffsetsRef.current = [];
      dragOriginRef.current = null;
    },
    [activeTool, addElement, setCurrentElement],
  );

  return {
    pointerEventsProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
      style: {
        touchAction: "none" as const,
        userSelect: "none" as const,
      },
    },
  };
}
