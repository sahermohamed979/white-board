import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { temporal } from "zundo";

import type { Element } from "../types/element.types";
import { BoardStore } from "../types/store-types";

export const useBoardStore = create<BoardStore>()(
  temporal(
    immer((set) => ({
      elements: [],
      backgroundColor: "bg-background",
      backgroundGrid: "none",
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

      setBackgroundColor: (color) =>
        set((state) => {
          state.backgroundColor = color;
        }),
      setBackgroundGrid: (grid) =>
        set((state) => {
          state.backgroundGrid = grid;
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

      setFillColor: (color) =>
        set((state) => {
          state.fillColor = color;
        }),

      setStrokeWidth: (width) =>
        set((state) => {
          state.strokeWidth = width;
        }),

      setBowing: (bowing) =>
        set((state) => {
          state.bowing = bowing;
        }),

      setDisableMultiStroke: (disabled) =>
        set((state) => {
          state.disableMultiStroke = disabled;
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

    {
      partialize: (state) => ({
        elements: state.elements,
      }),
      limit: 50,
      equality: (pastState, currentState) =>
        pastState.elements === currentState.elements,
    },
  ),
);
