export type Point = [number, number, number]; // [x, y, pressure]

export type ToolName =
  | "select"
  | "pen"
  | "hand"
  | "diamond"
  | "straightLine"
  | "rectangle"
  | "circle"
  | "arrow"
  | "text"
  | "eraser";

export type StrokeStyle = "solid" | "dashed" | "dotted";
export type FillStyle = "none" | "hachure" | "solid" | "cross-hatch";
export type FontFamily = "handwritten" | "sans" | "mono";
export type TextAlign = "left" | "center" | "right";

export interface BaseElement {
  id: string;
}
export interface HandElement extends BaseElement {
  type: "hand";
}
export interface StraightLineElement extends BaseElement {
  type: "straightLine";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle?: StrokeStyle;
  roughness?: number;
}
export interface DiamondElement extends BaseElement {
  type: "diamond";
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  strokeStyle?: StrokeStyle;
  fillStyle?: FillStyle;
  roughness?: number;
}

export interface FreehandElement extends BaseElement {
  type: "freehand";
  points: Point[];
  color: string;
  size: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: StrokeStyle;
}

export interface RectangleElement extends BaseElement {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  strokeStyle?: StrokeStyle;
  fillStyle?: FillStyle;
  roughness?: number;
}

export interface EllipseElement extends BaseElement {
  type: "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  strokeStyle?: StrokeStyle;
  fillStyle?: FillStyle;
  roughness?: number;
}

export interface ArrowElement extends BaseElement {
  type: "arrow";
  points: [Point, Point];
  strokeColor: string;
  strokeWidth: number;
  strokeStyle?: StrokeStyle;
}

export interface TextElement extends BaseElement {
  type: "text";
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  strokeColor?: string;
  fontFamily?: FontFamily;
  textAlign?: TextAlign;
}

export type Element =
  | HandElement
  | FreehandElement
  | DiamondElement
  | StraightLineElement
  | RectangleElement
  | EllipseElement
  | ArrowElement
  | TextElement;
