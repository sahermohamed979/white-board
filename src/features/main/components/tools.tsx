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
} from "lucide-react";
import { cn } from "@/src/shared/lib/utils";
import UploadImage from "./upload-image";
import { generateId } from "../lib/id";
import type { ImageElement } from "../types/element.types";

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

interface ToolsProps {
  viewportCenter: { x: number; y: number }; // ← جديد
}

export default function Tools({ viewportCenter }: ToolsProps) {
  const activeTool = useBoardStore((s) => s.activeTool);
  const setActiveTool = useBoardStore((s) => s.setActiveTool);
  const clearBoard = useBoardStore((s) => s.clearBoard);
  const addElement = useBoardStore((s) => s.addElement);
  const setSelectedIds = useBoardStore((s) => s.setSelectedIds);

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;

      const img = new window.Image();
      img.onload = () => {
        const maxWidth = 400;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const width = img.width * scale;
        const height = img.height * scale;

        const newId = generateId();
        const newEl: ImageElement = {
          id: newId,
          type: "image",
          x: viewportCenter.x - width / 2, // ← من الـ prop مباشرة
          y: viewportCenter.y - height / 2,
          width,
          height,
          src,
        };

        addElement(newEl);
        setActiveTool("select");
        setSelectedIds([newId]);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex max-w-[calc(100vw-16px)] flex-wrap items-center justify-center gap-1 rounded-2xl border border-popover-foreground bg-card px-2 py-1.5 shadow-lg backdrop-blur-md sm:top-5 sm:max-w-none sm:flex-nowrap sm:gap-1.5 sm:px-3 ">
      {TOOLS.map((tool) => (
        <Button
          key={tool.name}
          size="sm"
          variant={activeTool === tool.name ? "default" : "outline"}
          className={cn(
            "h-8 text-xs font-medium cursor-pointer text-primary-foreground",
            activeTool === tool.name && "text-white",
          )}
          onClick={() => setActiveTool(tool.name)}
        >
          {tool.label}
        </Button>
      ))}

      <UploadImage onImageSelect={handleImageSelect} />

      <div className="mx-1 h-4 w-px" />

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
