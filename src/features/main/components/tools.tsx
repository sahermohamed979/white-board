// src/features/main/components/tools.tsx
"use client";

import { Button } from "@/src/shared/components/ui/button";
import { useBoardStore, type ToolName } from "../hooks/main-hook";

const TOOLS: { name: ToolName; label: string }[] = [
  { name: "select", label: "Select" },
  { name: "pen", label: "Pen" },
  { name: "rectangle", label: "Rectangle" },
  { name: "circle", label: "Circle" },
  { name: "arrow", label: "Arrow" },
  { name: "text", label: "Text" },
  { name: "eraser", label: "Eraser" },
];

export default function Tools() {
  const activeTool = useBoardStore((s) => s.activeTool);
  const setActiveTool = useBoardStore((s) => s.setActiveTool);
  const clearBoard = useBoardStore((s) => s.clearBoard);

  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-md">
      {TOOLS.map((tool) => (
        <Button
          key={tool.name}
          size="sm"
          variant={activeTool === tool.name ? "default" : "outline"}
          className="h-8 text-xs font-medium cursor-pointer"
          onClick={() => setActiveTool(tool.name)}
        >
          {tool.label}
        </Button>
      ))}

      <div className="mx-1 h-4 w-px bg-gray-300" />

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