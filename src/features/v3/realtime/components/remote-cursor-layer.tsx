"use client";

import React, { useEffect, useState } from "react";
import type { ParticipantPresence } from "../types/realtime-collaboration.types";
import { RemoteCursor } from "./remote-cursor";
import type { Transform } from "@/src/features/v1/hooks/use-canvas-transform";

export interface RemoteCursorLayerProps {
  participants: ParticipantPresence[];
  subscribe: (listener: () => void) => () => void;
  getTransformSnapshot: () => Transform;
}

export function RemoteCursorLayer({
  participants,
  subscribe,
  getTransformSnapshot,
}: RemoteCursorLayerProps) {
  const [transform, setTransform] = useState<Transform>(() =>
    getTransformSnapshot(),
  );

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setTransform(getTransformSnapshot());
    });
    return unsubscribe;
  }, [subscribe, getTransformSnapshot]);

  if (!participants || participants.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none">
      <div
        className="w-full h-full will-change-transform"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {participants.map((participant) => (
          <RemoteCursor
            key={participant.participantId}
            participant={participant}
            scale={transform.scale}
          />
        ))}
      </div>
    </div>
  );
}

export default RemoteCursorLayer;
