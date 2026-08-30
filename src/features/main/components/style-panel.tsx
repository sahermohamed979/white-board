"use client";

import { Button } from "@/src/shared/components/ui/button";
import { useBoardStore } from "../store/board-store";
import { Slider } from "@/src/shared/components/ui/slider";

const STROKE_COLORS = ["#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00"];
const FILL_COLORS = ["transparent", "#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99"];
// const STROKE_WIDTHS = [1, 2, 4, 5];

export function StylePanel() {
  const selectedIds = useBoardStore((s) => s.selectedIds);
  const strokeColor = useBoardStore((s) => s.strokeColor);
  const fillColor = useBoardStore((s) => s.fillColor);
  const strokeWidth = useBoardStore((s) => s.strokeWidth);

  const setStrokeColor = useBoardStore((s) => s.setStrokeColor);
  const setFillColor = useBoardStore((s) => s.setFillColor);
  const setStrokeWidth = useBoardStore((s) => s.setStrokeWidth);
  const updateElement = useBoardStore((s) => s.updateElement);

  // Apply to selected elements as well as store defaults
  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    selectedIds.forEach((id) => updateElement(id, { strokeColor: color }));
  };

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    selectedIds.forEach((id) => updateElement(id, { fillColor: color }));
  };

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    selectedIds.forEach((id) => updateElement(id, { strokeWidth: width }));
  };

  // Display only when there's an active selection or user is drawing
  if (selectedIds.length === 0) return null;

  return (
    <div className="absolute top-20 left-6 z-20 flex flex-col gap-3 rounded-xl border border-gray-200 bg-card p-3 shadow-lg backdrop-blur-md">
      {/* Stroke Color */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
          Stroke
        </span>
        <div className="flex items-center gap-1.5">
          {STROKE_COLORS.map((c) => (
            <Button
              key={c}
              type="button"
              className={`h-6 w-6 rounded-full border border-gray-300 transition-transform ${
                strokeColor === c
                  ? "scale-110 ring-2 ring-blue-500"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: c }}
              onClick={() => handleStrokeColorChange(c)}
            />
          ))}
        </div>
      </div>

      {/* Fill Color */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
          Fill
        </span>
        <div className="flex items-center gap-1.5">
          {FILL_COLORS.map((c) => (
            <Button
              key={c}
              type="button"
              className={`h-6 w-6 rounded-full border border-gray-300 transition-transform ${
                fillColor === c
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
        </div>
      </div>

      {/* Stroke Width */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
          Width
        </span>
        <div className="flex items-center gap-1.5 pt-1 pb-1">
          <Slider
            min={1}
            max={20}
            step={1}
            
            value={strokeWidth}
            onValueChange={(value) => {
              if (typeof value === "number") {
                handleStrokeWidthChange(value);
              }
            }}
            className="w-32"
          />
         
        </div>
      </div>
    </div>
  );
}
