import { getStroke, type StrokeOptions } from "perfect-freehand";
import type { Point } from "../types/element.types";

/**
 * Converts stroke outline points into an SVG path string (Q curve).
 */
function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"] as (string | number)[]
  );

  d.push("Z");
  return d.join(" ");
}

/**
 * Produces an SVG path string from raw points using perfect-freehand.
 */
export function getSvgPathFromPoints(
  points: Point[],
  customOptions?: Partial<StrokeOptions>
): string {
  if (!points || points.length === 0) return "";

  const stroke = getStroke(points, {
    size: 6,
    thinning: 0.6,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: true,
    ...customOptions,
  });

  return getSvgPathFromStroke(stroke);
}
