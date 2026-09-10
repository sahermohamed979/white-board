"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Redo2, Undo2 } from "lucide-react";
import { useBoardStore } from "../store/board-store";
import { useStore } from "zustand";

interface ZoomIndicatorProps {
  scale: number;
  readonly?: boolean;
}
export default function ZoomUndoButtons({
  scale,
  readonly,
}: ZoomIndicatorProps) {
  const { undo, redo } = useBoardStore.temporal.getState();
  const pastStates = useStore(useBoardStore.temporal, (s) => s.pastStates);
  const futureStates = useStore(useBoardStore.temporal, (s) => s.futureStates);

  const percentage = Math.round(scale * 100);
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;
  return (
    <div className="fixed bottom-3 left-3 z-50 flex items-center gap-1 rounded-lg border border-popover-foreground bg-card px-1.5 py-1 text-xs font-medium shadow-md sm:absolute sm:bottom-5 sm:left-5 sm:gap-2 sm:px-3 sm:py-1.5">
      <Button
        variant="outline"
        size="icon-sm"
        className={readonly ? "hidden" : ""}
        disabled={!canUndo}
        onClick={() => undo()}
      >
        <Undo2 />
      </Button>
      <span>{percentage}%</span>
      <Button
        variant="outline"
        size="icon-sm"
        className={readonly ? "hidden" : ""}
        disabled={!canRedo}
        onClick={() => redo()}
      >
        <Redo2 />
      </Button>
    </div>
  );
}
