"use client";

import React, { forwardRef } from "react";

import { useBoardStore } from "../store/board-store";
import { ElementRenderer } from "./element-renderer";

import type { Transform } from "../hooks/use-canvas-transform";

export interface CanvasSvgLayerProps
  extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
  canvasTransform?: Transform;
}

export const CanvasSvgLayer = forwardRef<
  SVGSVGElement,
  CanvasSvgLayerProps
>(({ children, className = "", style, canvasTransform, ...props }, ref) => {
  const elements = useBoardStore((s) => s.elements);
  const currentElement = useBoardStore((s) => s.currentElement);

  const transform = canvasTransform ?? {
    x: 0,
    y: 0,
    scale: 1,
  };

  return (
    <svg
      ref={ref}
      className={`fixed inset-0 h-full w-full touch-none select-none  ${className}`}
      style={style}
      {...props}
    >
      <g
        transform={`translate(${transform.x} ${transform.y}) scale(${transform.scale})`}
      >
        {/* Persistent board elements */}
        {elements.map((element) => (
          <ElementRenderer
            key={element.id}
            element={element}
          />
        ))}

        {/* Current drawing */}
        {currentElement && (
          <ElementRenderer element={currentElement} />
        )}

        {/* Selection */}
        {children}
      </g>
    </svg>
  );
});

CanvasSvgLayer.displayName = "CanvasSvgLayer";