import type { Element } from "../types/element.types";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Computes a standardized bounding box { x, y, width, height } for any element type.
 */
export function getBoundingBox(element: Element): BoundingBox {
  switch (element.type) {
    case "rectangle":
    case "circle": {
      const minX = Math.min(element.x, element.x + element.width);
      const minY = Math.min(element.y, element.y + element.height);
      const width = Math.abs(element.width);
      const height = Math.abs(element.height);
      return { x: minX, y: minY, width, height };
    }

    case "diamond": {
      const minX = Math.min(element.x, element.x + element.width);
      const minY = Math.min(element.y, element.y + element.height);
      const width = Math.abs(element.width);
      const height = Math.abs(element.height);
      return { x: minX, y: minY, width, height };
    }
    case "straightLine": {
      const minX = Math.min(element.x1, element.x2);
      const minY = Math.min(element.y1, element.y2);
      const width = Math.abs(element.x2 - element.x1);
      const height = Math.abs(element.y2 - element.y1);
      return { x: minX, y: minY, width, height };
    }

    case "arrow": {
      const [p1, p2] = element.points;
      const minX = Math.min(p1[0], p2[0]);
      const maxX = Math.max(p1[0], p2[0]);
      const minY = Math.min(p1[1], p2[1]);
      const maxY = Math.max(p1[1], p2[1]);
      return {
        x: minX,
        y: minY,
        width: Math.max(maxX - minX, 10),
        height: Math.max(maxY - minY, 10),
      };
    }

    case "freehand": {
      if (!element.points || element.points.length === 0) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      for (const [px, py] of element.points) {
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }

      return {
        x: minX,
        y: minY,
        width: Math.max(maxX - minX, 5),
        height: Math.max(maxY - minY, 5),
      };
    }

    case "text": {
      const lines = element.text.split("\n");
      const maxLineLength = Math.max(...lines.map((l) => l.length), 1);
      const approxCharWidth = element.fontSize * 0.6;
      const approxLineHeight = element.fontSize * 1.3;

      return {
        x: element.x,
        y: element.y,
        width: Math.max(maxLineLength * approxCharWidth, 20),
        height: Math.max(lines.length * approxLineHeight, element.fontSize),
      };
    }

    default:
      return { x: 0, y: 0, width: 0, height: 0 };
  }
}
