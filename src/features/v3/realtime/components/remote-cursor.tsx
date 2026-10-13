"use client";

import React from "react";
import type { ParticipantPresence } from "../types/realtime-collaboration.types";

export interface RemoteCursorProps {
  participant: ParticipantPresence;
  scale?: number;
}

export function RemoteCursor({ participant, scale = 1 }: RemoteCursorProps) {
  const { color, cursor, name } = participant;

  if (!cursor) return null;

  // Counteract canvas zoom scale so the cursor stays readable and consistent
  const cursorScale = Math.max(0.5, Math.min(2, 1 / scale));

  return (
    <div
      className="absolute top-0 left-0 pointer-events-none transition-transform duration-75 ease-out select-none will-change-transform"
      style={{
        transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
      }}
    >
      <div
        style={{
          transform: `scale(${cursorScale})`,
          transformOrigin: "0 0",
        }}
        className="relative"
      >
        {/* SVG Cursor Arrow */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <path
            d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
            fill={color}
            stroke="#ffffff"
            strokeWidth="1.2"
          />
        </svg>

        {/* Participant Name Tag */}
        {name && (
          <div
            className="absolute left-4 top-4 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
            style={{ backgroundColor: color }}
          >
            {name}
          </div>
        )}
      </div>
    </div>
  );
}

export default RemoteCursor;
