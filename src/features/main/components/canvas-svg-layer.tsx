"use client";

import React, { forwardRef } from "react";
import { useBoardStore } from "../store/board-store";
import { ElementRenderer } from "./element-renderer";

export interface CanvasSvgLayerProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
}

export const CanvasSvgLayer = forwardRef<SVGSVGElement, CanvasSvgLayerProps>(
  ({ children, className = "", style, ...props }, ref) => {
    const elements = useBoardStore((s) => s.elements);
    const currentElement = useBoardStore((s) => s.currentElement);

    return (
      <svg
        ref={ref}
        className={`fixed inset-0 h-full w-full touch-none select-none bg-white ${className}`}
        style={style}
        {...props}
      >
        {/* Render persistent board elements */}
        {elements.map((element) => (
          <ElementRenderer key={element.id} element={element} />
        ))}

        {/* Render transient drawing preview element */}
        {currentElement && <ElementRenderer element={currentElement} />}

        {/* Extra children such as selection overlays */}
        {children}
      </svg>
    );
  }
);

CanvasSvgLayer.displayName = "CanvasSvgLayer";
