// src/features/main/components/tools.tsx
"use client";

import { Button } from "@/src/shared/components/ui/button";
import { useBoardStore, type ToolName } from "../hooks/main-hook";
import {
  Diamond,
  Hand,
  Pen,
  RectangleHorizontal,
  Circle,
  Type,
  Eraser,
  MoveHorizontal,
  Minus,
  ImagePlus,
} from "lucide-react";
import { cn } from "@/src/shared/lib/utils";

const TOOLS: { name: ToolName; label: React.ReactNode | string }[] = [
  { name: "select", label: "Select" },
  { name: "hand", label: <Hand /> },
  { name: "diamond", label: <Diamond /> },
  { name: "pen", label: <Pen /> },
  { name: "straightLine", label: <Minus /> },
  { name: "rectangle", label: <RectangleHorizontal /> },
  { name: "circle", label: <Circle /> },
  { name: "arrow", label: <MoveHorizontal /> },
  { name: "text", label: <Type /> },
  { name: "eraser", label: <Eraser /> },
];

export default function Tools() {
  const activeTool = useBoardStore((s) => s.activeTool);
  const setActiveTool = useBoardStore((s) => s.setActiveTool);
  const clearBoard = useBoardStore((s) => s.clearBoard);

  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-2xl border  border-popover-foreground bg-card px-3 py-1.5 shadow-lg backdrop-blur-md">
      {TOOLS.map((tool) => (
        <Button
          key={tool.name}
          size="sm"
          variant={activeTool === tool.name ? "default" : "outline"}
          className={cn(
            "h-8 text-xs font-medium cursor-pointer text-primary-foreground",
            activeTool === tool.name && " text-white",
          )}
          onClick={() => setActiveTool(tool.name)}
        >
          {tool.label}
        </Button>
      ))}
      <label
        htmlFor="image-upload"
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
      >
        <ImagePlus className="h-5 w-5" />
      </label>

      <input
        id="image-upload"
        type="file"
        className="hidden"
        accept="image/* "
      
      />

      <div className="mx-1 h-4 w-px " />

      <Button
        size="sm"
        variant="destructive"
        className="h-8 text-xs font-medium cursor-pointer"
        onClick={clearBoard}
      >
        Clear
      </Button>
    </div>
  );
}
