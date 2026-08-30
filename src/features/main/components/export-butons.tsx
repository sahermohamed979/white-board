"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/shared/components/ui/dropdown-menu"; 
import { exportBoardAsPng, exportBoardAsJpeg } from "../lib/export";

interface ExportButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  backgroundColor?: string;
}

export function ExportButton({
  containerRef,
  backgroundColor,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "png" | "jpeg") => {
    if (!containerRef.current) return;
    setIsExporting(true);
    try {
      if (format === "png") {
        await exportBoardAsPng(
          containerRef.current,
          "board.png",
          backgroundColor,
        );
      } else {
        await exportBoardAsJpeg(
          containerRef.current,
          "board.jpeg",
          backgroundColor,
        );
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size="sm" variant="outline" disabled={isExporting}>
            <Download size={16} className="mr-1" />
            {isExporting ? "..." : "Export"}
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right">
        <DropdownMenuItem onClick={() => handleExport("png")}>
          PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("jpeg")}>
          JPEG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
