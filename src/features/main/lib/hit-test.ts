import type { Element, Point } from "../types/element.types";
import { getBoundingBox } from "./bounding-box";

/**
 * Calculates Euclidean distance from a point P to a line segment AB.
 */
function distanceToLineSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    return Math.hypot(px - x1, py - y1);
  }

  // Projection parameter t
  let t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));

  const projX = x1 + t * dx;
  const projY = y1 + t * dy;

  return Math.hypot(px - projX, py - projY);
}

/**
 * Performs a precise hit-test to determine whether a given point intersects an element.
 */
export function isPointInElement(
  point: [number, number] | Point,
  element: Element,
  threshold: number = 8,
): boolean {
  const [px, py] = point;

  switch (element.type) {
    case "rectangle":
    case "text": {
      const box = getBoundingBox(element);
      return (
        px >= box.x - threshold &&
        px <= box.x + box.width + threshold &&
        py >= box.y - threshold &&
        py <= box.y + box.height + threshold
      );
    }
    case "diamond": {
      const box = getBoundingBox(element);
      const rx = box.width / 2;
      const ry = box.height / 2;
      const cx = box.x + rx;
      const cy = box.y + ry;
      if (rx === 0 || ry === 0) return false;
      const normalizedDist =
        Math.pow((px - cx) / (rx + threshold), 2) +
        Math.pow((py - cy) / (ry + threshold), 2);
      return normalizedDist <= 1;
    }
    case "circle": {
      const box = getBoundingBox(element);
      const rx = box.width / 2;
      const ry = box.height / 2;
      const cx = box.x + rx;
      const cy = box.y + ry;

      if (rx === 0 || ry === 0) return false;

      // Normalized ellipse equation ((x-cx)^2 / rx^2) + ((y-cy)^2 / ry^2) <= 1 + margin
      const normalizedDist =
        Math.pow((px - cx) / (rx + threshold), 2) +
        Math.pow((py - cy) / (ry + threshold), 2);

      return normalizedDist <= 1;
    }

    case "arrow": {
      const [p1, p2] = element.points;
      const dist = distanceToLineSegment(px, py, p1[0], p1[1], p2[0], p2[1]);
      return dist <= threshold + (element.strokeWidth || 2) / 2;
    }

    case "freehand": {
      if (!element.points || element.points.length === 0) return false;
      if (element.points.length === 1) {
        const [p0x, p0y] = element.points[0];
        return Math.hypot(px - p0x, py - p0y) <= threshold + element.size / 2;
      }

      for (let i = 0; i < element.points.length - 1; i++) {
        const [x1, y1] = element.points[i];
        const [x2, y2] = element.points[i + 1];
        const dist = distanceToLineSegment(px, py, x1, y1, x2, y2);
        if (dist <= threshold + element.size / 2) {
          return true;
        }
      }

      return false;
    }

    default:
      return false;
  }
}
