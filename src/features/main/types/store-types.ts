
import {
  Element,
  FillStyle,
  FontFamily,
  StrokeStyle,
  TextAlign,
  ToolName
} from "./element.types";

export interface BoardStore {
  elements: Element[];
  backgroundColor: string;
  backgroundGrid: string;
  currentElement: Element | null;
  activeTool: ToolName;
  selectedIds: string[];
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  fillStyle: FillStyle;
  roughness: number;
  bowing: number;
  disableMultiStroke: boolean;
  fontSize: number;
  fontFamily: FontFamily;
  textAlign: TextAlign;

  setActiveTool: (tool: ToolName) => void;
  setSelectedIds: (ids: string[]) => void;
  addElement: (element: Element) => void;
  setElements: (elements: Element[]) => void;
  setCurrentElement: (element: Element | null) => void;
  updateElement: (id: string, partial: Partial<Element>) => void;
  updateMultipleElements: (
    updates: Array<{ id: string; partial: Partial<Element> }>,
  ) => void;
  deleteElements: (ids: string[]) => void;
  clearBoard: () => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setBowing: (bowing: number) => void; // ← ضيف السطر ده
  setDisableMultiStroke: (disabled: boolean) => void;
  setStrokeStyle: (style: StrokeStyle) => void;
  setFillStyle: (style: FillStyle) => void;
  setRoughness: (roughness: number) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: FontFamily) => void;
  setBackgroundColor: (color: string) => void;
  setBackgroundGrid: (grid: string) => void;
  setTextAlign: (align: TextAlign) => void;
}