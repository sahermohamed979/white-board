'use client';

import { Button } from "@/src/shared/components/ui/button";
import { useBoardStore } from "../store/board-store";
import { backgroundsGrids } from "../constants/grid.constant";

export default function GridBackground() {
  const setBackgroundGrid = useBoardStore((state) => state.setBackgroundGrid);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 w-full">
        {backgroundsGrids.map((background) => (
          <Button
            variant="outlineBg"
            key={background.id}
            onClick={() => setBackgroundGrid(background.id)}
            className={`${background.className} w-6 h-6 rounded-sm cursor-pointer`}
            style={background.style}
          />
        ))}
      </div>
    </div>
  );
}
