export type Point = [number, number, number]; // [x, y, pressure]

export type ToolName =
  | "select"
  | "pen"
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
  | FreehandElement
  | RectangleElement
  | EllipseElement
  | ArrowElement
  | TextElement;
