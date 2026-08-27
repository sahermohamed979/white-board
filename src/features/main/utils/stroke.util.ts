import { getStroke, StrokeOptions } from "perfect-freehand";
import type { Point } from "../types/element";

/**
 * Converts outline stroke points into an SVG path string.
 */
export function getSvgPathFromStroke(stroke: number[][]): string {
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
 * Generates an SVG path string from raw points using perfect-freehand.
 */
export function generateStrokePath(
  points: Point[],
  options: StrokeOptions = {}
): string {
  if (!points.length) return "";

  const stroke = getStroke(points, {
    size: 15,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
    simulatePressure: true,
    ...options,
  });

  return getSvgPathFromStroke(stroke);
}
