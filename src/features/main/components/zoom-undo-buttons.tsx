"use client";

import { Button } from "@/src/shared/components/ui/button";
import { Redo2, Undo2 } from "lucide-react";
import { useBoardStore } from "../store/board-store";
import { useStore } from "zustand";

interface ZoomIndicatorProps {
  scale: number;
}
export default function ZoomUndoButtons({ scale }: ZoomIndicatorProps) {
  const { undo, redo } = useBoardStore.temporal.getState();
  const pastStates = useStore(useBoardStore.temporal, (s) => s.pastStates);
  const futureStates = useStore(useBoardStore.temporal, (s) => s.futureStates);

  const percentage = Math.round(scale * 100);
  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;
  return (
    <div className="absolute bottom-5 left-5 z-10 flex items-center gap-2 rounded-lg border border-popover-foreground bg-card px-3 py-1.5 text-xs font-medium shadow-md">
      <Button
        variant="outline"
        size="lg"
        disabled={!canUndo}
        onClick={() => undo()}
      >
        <Undo2 />
      </Button>
      <span>{percentage}%</span>
      <Button
        variant="outline"
        size="lg"
        disabled={!canRedo}
        onClick={() => redo()}
      >
        <Redo2 />
      </Button>
    </div>
  );
}
