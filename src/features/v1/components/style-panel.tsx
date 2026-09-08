"use client";

import { Button } from "@/src/shared/components/ui/button";
import { useBoardStore } from "../store/board-store";
import { Slider } from "@/src/shared/components/ui/slider";
import type { Element } from "../types/element.types";

import ColorPicker from "./color-picker";

const STROKE_COLORS = ["#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00"];
const FILL_COLORS = ["transparent", "#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99"];
// const STROKE_WIDTHS = [1, 2, 4, 5];

function getElementStrokeColor(el: Element): string | undefined {
  if (el.type === "freehand") return el.strokeColor || el.color;
  if (el.type === "text") return el.strokeColor || el.color;
  if (
    el.type === "rectangle" ||
    el.type === "circle" ||
    el.type === "diamond" ||
    el.type === "straightLine" ||
    el.type === "arrow"
  ) {
    return el.strokeColor;
  }
  return undefined;
}

function getElementFillColor(el: Element): string | undefined {
  if (
    el.type === "rectangle" ||
    el.type === "circle" ||
    el.type === "diamond"
  ) {
    return el.fillColor;
  }
  return undefined;
}

function getElementStrokeWidth(el: Element): number | undefined {
  if (el.type === "freehand") {
    return el.strokeWidth ?? (el.size ? Math.round(el.size / 3) : undefined);
  }
  if (
    el.type === "rectangle" ||
    el.type === "circle" ||
    el.type === "diamond" ||
    el.type === "straightLine" ||
    el.type === "arrow"
  ) {
    return el.strokeWidth;
  }
  return undefined;
}

export function StylePanel() {
  const activeTool = useBoardStore((s) => s.activeTool);
  const selectedIds = useBoardStore((s) => s.selectedIds);
  const elements = useBoardStore((s) => s.elements);
  const strokeColor = useBoardStore((s) => s.strokeColor);
  const fillColor = useBoardStore((s) => s.fillColor);
  const strokeWidth = useBoardStore((s) => s.strokeWidth);

  const setStrokeColor = useBoardStore((s) => s.setStrokeColor);
  const setFillColor = useBoardStore((s) => s.setFillColor);
  const setStrokeWidth = useBoardStore((s) => s.setStrokeWidth);
  const updateElement = useBoardStore((s) => s.updateElement);

  const isSelection = selectedIds.length > 0;
  const selectedElements = isSelection
    ? elements.filter((el) => selectedIds.includes(el.id))
    : [];

  const DRAWING_TOOLS = [
    "pen",
    "straightLine",
    "rectangle",
    "circle",
    "diamond",
    "arrow",
    "text",
  ];

  // If selection exists but no matching elements found
  if (isSelection && selectedElements.length === 0) {
    return null;
  }

  // If no selection and active tool is not a styling/drawing tool
  if (!isSelection && !DRAWING_TOOLS.includes(activeTool)) {
    return null;
  }

  // Determine which style controls should be displayed
  const showStrokeColor = isSelection
    ? selectedElements.some((el) => el.type !== "image")
    : DRAWING_TOOLS.includes(activeTool);

  const showFillColor = isSelection
    ? selectedElements.some(
        (el) =>
          el.type === "rectangle" ||
          el.type === "circle" ||
          el.type === "diamond",
      )
    : activeTool === "rectangle" ||
      activeTool === "circle" ||
      activeTool === "diamond";

  const showStrokeWidth = isSelection
    ? selectedElements.some((el) => el.type !== "image" && el.type !== "text")
    : activeTool !== "text" && DRAWING_TOOLS.includes(activeTool);

  // If no style options are relevant (e.g. image selected), don't render panel
  if (!showStrokeColor && !showFillColor && !showStrokeWidth) {
    return null;
  }

  // Determine current active values to highlight in UI
  const firstSelected = selectedElements[0];
  const currentStrokeColor =
    isSelection && firstSelected
      ? (getElementStrokeColor(firstSelected) ?? strokeColor)
      : strokeColor;

  const currentFillColor =
    isSelection && firstSelected
      ? (getElementFillColor(firstSelected) ?? fillColor)
      : fillColor;

  const currentStrokeWidth =
    isSelection && firstSelected
      ? (getElementStrokeWidth(firstSelected) ?? strokeWidth)
      : strokeWidth;

  // Apply to selected elements as well as store defaults
  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    if (isSelection) {
      selectedElements.forEach((el) => {
        if (el.type === "freehand" || el.type === "text") {
          updateElement(el.id, { strokeColor: color, color });
        } else if (el.type !== "image") {
          updateElement(el.id, { strokeColor: color });
        }
      });
    }
  };

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    if (isSelection) {
      selectedElements.forEach((el) => {
        if (
          el.type === "rectangle" ||
          el.type === "circle" ||
          el.type === "diamond"
        ) {
          updateElement(el.id, { fillColor: color });
        }
      });
    }
  };

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    if (isSelection) {
      selectedElements.forEach((el) => {
        if (el.type === "freehand") {
          updateElement(el.id, { strokeWidth: width, size: width * 3 });
        } else if (el.type !== "image" && el.type !== "text") {
          updateElement(el.id, { strokeWidth: width });
        }
      });
    }
  };

  return (
    <div className="absolute top-25 left-6 z-20 flex flex-col gap-3 rounded-xl border border-gray-200 bg-card p-3 shadow-lg backdrop-blur-md">
      {/* Stroke Color */}
      {showStrokeColor && (
        <div className="flex flex-col  gap-1">
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            Color
          </span>
          <div className="flex flex-col md:flex-row gap-1.5">
            {STROKE_COLORS.map((c) => (
              <Button
                key={c}
                type="button"
                className={`h-6 w-6 rounded-full border border-gray-300 transition-transform ${
                  currentStrokeColor === c
                    ? "scale-110 ring-2 ring-blue-500"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
                onClick={() => handleStrokeColorChange(c)}
              />
            ))}
            <ColorPicker
              currentStrokeColor={currentStrokeColor}
              handleStrokeColorChange={handleStrokeColorChange}
            />
          </div>
        </div>
      )}

      {/* Fill Color */}
      {showFillColor && (
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            Fill
          </span>
          <div className="flex flex-col md:flex-row gap-1.5">
            {FILL_COLORS.map((c) => (
              <Button
                key={c}
                type="button"
                className={`h-6 w-6 rounded-full border border-gray-300 transition-transform ${
                  currentFillColor === c
                    ? "scale-110 ring-2 ring-blue-500"
                    : "hover:scale-105"
                } ${c === "transparent" ? "bg-card relative overflow-hidden" : ""}`}
                style={{ backgroundColor: c !== "transparent" ? c : undefined }}
                onClick={() => handleFillColorChange(c)}
              >
                {c === "transparent" && (
                  <div className="absolute inset-0 flex items-center justify-center text-[9px] text-gray-400 font-bold">
                    /
                  </div>
                )}
              </Button>
            ))}
            <ColorPicker
              currentStrokeColor={currentFillColor}
              handleStrokeColorChange={handleFillColorChange}
            />
          </div>
        </div>
      )}

      {/* Stroke Width */}
      {showStrokeWidth && (
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            Width
          </span>
          <div className="flex flex-col md:flex-row gap-1.5 pt-1 pb-1">
            <Slider
              min={1}
              max={20}
              step={1}
              value={currentStrokeWidth}
              onValueChange={(value) => {
                if (typeof value === "number") {
                  handleStrokeWidthChange(value);
                }
              }}
              className="w-32"
            />
          </div>
        </div>
      )}
    </div>
  );
}
