"use client";
import { Button } from "@/src/shared/components/ui/button";
import { useBoardStore } from "../store/board-store";
const backgrounds = ["bg-bg-0", "bg-bg-1", "bg-bg-2", "bg-bg-3", "bg-bg-4"];

export default function BackgroundSelection() {
  const backgroundColor = useBoardStore((state) => state.backgroundColor);
  const setBackgroundColor = useBoardStore((state) => state.setBackgroundColor);
  return (
    <div className="flex flex-col gap-2 w-full ">
      <div className="flex gap-2 w-full ">
        {backgrounds.map((b) => (
          <Button
            variant={"outlineBg"}
            key={b}
            onClick={() => setBackgroundColor(b)}
            className={`${b} w-6 h-6 rounded-full cursor-pointer transition-transform ${
              backgroundColor === b ? "ring-2 ring-primary scale-110" : "hover:scale-105"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
