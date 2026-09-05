"use client";

import { useState } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/src/shared/lib/utils";
import UploadImage from "./upload-image";
import { generateId } from "../lib/id";
import type { ImageElement } from "../types/element.types";
import { useTranslations } from "next-intl";

interface ToolsProps {
  viewportCenter: { x: number; y: number };
}

export default function Tools({ viewportCenter }: ToolsProps) {
  const [isToolsOpen, setIsToolsOpen] = useState(true);
  const activeTool = useBoardStore((s) => s.activeTool);
  const setActiveTool = useBoardStore((s) => s.setActiveTool);
  const clearBoard = useBoardStore((s) => s.clearBoard);
  const addElement = useBoardStore((s) => s.addElement);
  const setSelectedIds = useBoardStore((s) => s.setSelectedIds);
  const t = useTranslations();
  const TOOLS: { name: ToolName; label: React.ReactNode | string }[] = [
    { name: "select", label: t("main.tools.select") },
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
          x: viewportCenter.x - width / 2, //
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
    <div
      className={cn(
        "absolute top-25 right-5 left-auto z-10 grid grid-rows-[0fr_auto] items-center justify-center overflow-hidden rounded-2xl border border-popover-foreground bg-card  md:p-0  shadow-lg backdrop-blur-md transition-[grid-template-rows] duration-300 ease-out md:top-9 md:right-auto md:left-1/2 md:-translate-x-1/2 md:grid-cols-[0fr_auto] md:grid-rows-none md:transition-[grid-template-columns]",
        isToolsOpen
          ? "grid-rows-[1fr_auto] md:grid-cols-[1fr_auto] md:p-1 py-2 px-0.5 justify-items-center"
          : "grid-rows-[0fr_auto] md:grid-cols-[0fr_auto] justify-items-center w-8 ",
      )}
    >
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-col items-center gap-1 overflow-hidden md:flex-row",
          !isToolsOpen && "pointer-events-none invisible",
        )}
        aria-hidden={!isToolsOpen}
        inert={!isToolsOpen}
      >
        {TOOLS.map((tool) => (
          <Button
            key={tool.name}
            size="sm"
            variant={activeTool === tool.name ? "default" : "outline"}
            className={cn(
              "h-8 cursor-pointer p-1 text-xs font-medium text-primary-foreground md:p-2",
              activeTool === tool.name && "text-white",
            )}
            onClick={() => setActiveTool(tool.name)}
            tabIndex={isToolsOpen ? 0 : -1}
          >
            {tool.label}
          </Button>
        ))}

        <UploadImage onImageSelect={handleImageSelect} />

        <div className="mx-1 hidden h-4 w-px md:block" />

        <Button
          size="sm"
          className="mt-2 h-8 cursor-pointer bg-transparent text-xs font-medium text-destructive md:mt-0 md:bg-destructive md:text-white"
          onClick={clearBoard}
          tabIndex={isToolsOpen ? 0 : -1}
        >
          {t("main.tools.clear")}
        </Button>
      </div>

      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-8 w-8 shrink-0 cursor-pointer flex justify-center items-center"
        aria-label={isToolsOpen ? t("main.tools.close") : t("main.tools.open")}
        title={isToolsOpen ? t("main.tools.close") : t("main.tools.open")}
        aria-expanded={isToolsOpen}
        onClick={() => setIsToolsOpen((isOpen) => !isOpen)}
      >
        {isToolsOpen ? (
          <PanelLeftClose className="h-4 w-4 rotate-90 md:rotate-0" />
        ) : (
          <PanelLeftOpen className="h-4 w-4 rotate-90 md:rotate-0" />
        )}
      </Button>
    </div>
  );
}
