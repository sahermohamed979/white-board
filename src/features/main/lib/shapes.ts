import rough from "roughjs";
import type { FillStyle, Point, StrokeStyle } from "../types/element.types";

const generator = rough.generator();

export interface RoughPathData {
  d: string;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  strokeLineDash?: number[];
}

function getDashArray(strokeStyle?: StrokeStyle): number[] | undefined {
  if (strokeStyle === "dashed") return [8, 8];
  if (strokeStyle === "dotted") return [3, 5];
  return undefined;
}

//  generates diamond pattern for the fill
export function getDiamondSvgPaths(
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor?: string,
  strokeWidth: number = 2,
  strokeStyle?: StrokeStyle,
  fillStyle?: FillStyle,
  roughness: number = 1,
): RoughPathData[] {
  const dash = getDashArray(strokeStyle);

  const effectiveFill =
    fillColor &&
    fillColor !== "transparent" &&
    fillStyle !== "none"
      ? fillColor
      : undefined;

  const centerX = x + width / 2;
  const centerY = y + height / 2;

  const points: [number, number][] = [
    [centerX, y],           
    [x + width, centerY],   
    [centerX, y + height],   
    [x, centerY],           
  ];

  const shape = generator.polygon(points, {
    stroke: strokeColor,
    fill: effectiveFill,
    fillStyle:
      fillStyle === "none"
        ? undefined
        : fillStyle || "solid",
    strokeWidth,
    strokeLineDash: dash,
    roughness,
    bowing: 1,
    hachureAngle: 60,
    hachureGap: 6,
  });

  const paths = generator.toPaths(shape);

  return paths.map((p) => ({
    d: p.d,
    stroke: p.stroke,
    fill: p.fill,
    strokeWidth: p.strokeWidth,
    strokeLineDash: dash,
  }));
}

/**
 * Generates rough SVG path data for a rectangle with style parameters.
 */
export function getRectangleSvgPaths(
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor?: string,
  strokeWidth: number = 2,
  strokeStyle?: StrokeStyle,
  fillStyle?: FillStyle,
  roughness: number = 1,
): RoughPathData[] {
  const dash = getDashArray(strokeStyle);
  const effectiveFill =
    fillColor && fillColor !== "transparent" && fillStyle !== "none"
      ? fillColor
      : undefined;

  const shape = generator.rectangle(x, y, width, height, {
    stroke: strokeColor,
    fill: effectiveFill,
    fillStyle: fillStyle === "none" ? undefined : fillStyle || "solid",
    strokeWidth,
    strokeLineDash: dash,
    roughness,
    bowing: 1,
    hachureAngle: 60,
    hachureGap: 6,
  });

  const paths = generator.toPaths(shape);
  return paths.map((p) => ({
    d: p.d,
    stroke: p.stroke,
    fill: p.fill,
    strokeWidth: p.strokeWidth,
    strokeLineDash: dash,
  }));
}

/**
 * Generates rough SVG path data for an ellipse / circle with style parameters.
 */
export function getEllipseSvgPaths(
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor?: string,
  strokeWidth: number = 2,
  strokeStyle?: StrokeStyle,
  fillStyle?: FillStyle,
  roughness: number = 1,
): RoughPathData[] {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const dash = getDashArray(strokeStyle);
  const effectiveFill =
    fillColor && fillColor !== "transparent" && fillStyle !== "none"
      ? fillColor
      : undefined;

  const shape = generator.ellipse(centerX, centerY, width, height, {
    stroke: strokeColor,
    fill: effectiveFill,
    fillStyle: fillStyle === "none" ? undefined : fillStyle || "solid",
    strokeWidth,
    strokeLineDash: dash,
    roughness,
    bowing: 1,
    hachureAngle: 60,
    hachureGap: 6,
  });

  const paths = generator.toPaths(shape);
  return paths.map((p) => ({
    d: p.d,
    stroke: p.stroke,
    fill: p.fill,
    strokeWidth: p.strokeWidth,
    strokeLineDash: dash,
  }));
}

/**
 * Generates SVG path data for an arrow (main shaft + arrowhead wings).
 */
export function getArrowSvgPath(
  startPoint: Point,
  endPoint: Point,
  headLength: number = 16,
  headAngle: number = Math.PI / 6,
): string {
  const [x1, y1] = startPoint;
  const [x2, y2] = endPoint;

  const angle = Math.atan2(y2 - y1, x2 - x1);

  const headLeftX = x2 - headLength * Math.cos(angle - headAngle);
  const headLeftY = y2 - headLength * Math.sin(angle - headAngle);

  const headRightX = x2 - headLength * Math.cos(angle + headAngle);
  const headRightY = y2 - headLength * Math.sin(angle + headAngle);

  return `M ${x1} ${y1} L ${x2} ${y2} M ${headLeftX} ${headLeftY} L ${x2} ${y2} L ${headRightX} ${headRightY}`;
}
