import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  Element,
  FillStyle,
  FontFamily,
  StrokeStyle,
  TextAlign,
  ToolName,
} from "../types/element.types";

export type {
  Element,
  FillStyle,
  FontFamily,
  StrokeStyle,
  TextAlign,
  ToolName,
} from "../types/element.types";

export interface BoardStore {
  elements: Element[];
  backgroundColor: string;
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
  setTextAlign: (align: TextAlign) => void;
}

export const useBoardStore = create<BoardStore>()(
  immer((set) => ({
    elements: [],
    backgroundColor: "var(--background)",

    currentElement: null,
    activeTool: "select",
    selectedIds: [],
    strokeColor: "var(--primary)",
    fillColor: "transparent",
    strokeWidth: 2,
    strokeStyle: "solid",
    fillStyle: "hachure",
    roughness: 0,
    bowing: 0.5,
    disableMultiStroke: true,
    fontSize: 20,
    fontFamily: "sans",
    textAlign: "left",

    setActiveTool: (tool) =>
      set((state) => {
        state.activeTool = tool;
        if (tool !== "select") {
          state.selectedIds = [];
        }
      }),

    setSelectedIds: (ids) =>
      set((state) => {
        state.selectedIds = ids;
      }),

    addElement: (element) =>
      set((state) => {
        state.elements.push(element);
      }),

    setElements: (elements) =>
      set((state) => {
        state.elements = elements;
      }),

    setCurrentElement: (element) =>
      set((state) => {
        state.currentElement = element;
      }),

    updateElement: (id, partial) =>
      set((state) => {
        const index = state.elements.findIndex((el) => el.id === id);
        if (index !== -1) {
          state.elements[index] = {
            ...state.elements[index],
            ...partial,
          } as Element;
        }
      }),

    deleteElements: (ids) =>
      set((state) => {
        const idSet = new Set(ids);
        state.elements = state.elements.filter((el) => !idSet.has(el.id));
        state.selectedIds = state.selectedIds.filter((id) => !idSet.has(id));
      }),

    clearBoard: () =>
      set((state) => {
        state.elements = [];
        state.currentElement = null;
        state.selectedIds = [];
      }),

    setStrokeColor: (color) =>
      set((state) => {
        state.strokeColor = color;
      }),
    setBowing: (
      bowing, // ← ضيف الـ action ده
    ) =>
      set((state) => {
        state.bowing = bowing;
      }),

    setDisableMultiStroke: (
      disabled, // ← وده
    ) =>
      set((state) => {
        state.disableMultiStroke = disabled;
      }),
    setFillColor: (color) =>
      set((state) => {
        state.fillColor = color;
      }),

    setStrokeWidth: (width) =>
      set((state) => {
        state.strokeWidth = width;
      }),

    setStrokeStyle: (style) =>
      set((state) => {
        state.strokeStyle = style;
      }),

    setFillStyle: (style) =>
      set((state) => {
        state.fillStyle = style;
      }),

    setRoughness: (roughness) =>
      set((state) => {
        state.roughness = roughness;
      }),

    setFontSize: (size) =>
      set((state) => {
        state.fontSize = size;
      }),

    setFontFamily: (family) =>
      set((state) => {
        state.fontFamily = family;
      }),

    setTextAlign: (align) =>
      set((state) => {
        state.textAlign = align;
      }),
  })),
);
