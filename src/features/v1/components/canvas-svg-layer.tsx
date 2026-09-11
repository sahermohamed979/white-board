"use client";

import React, { forwardRef } from "react";

import { useBoardStore } from "../store/board-store";
import { ElementRenderer } from "./element-renderer";

import type { Element } from "../types/element.types";

export interface CanvasSvgLayerProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
  viewportGroupRef?: React.RefObject<SVGGElement | null>;
  elementsShared?: Element[] | [];
  readonly: boolean;
}

export const CanvasSvgLayer = forwardRef<SVGSVGElement, CanvasSvgLayerProps>(
  (
    {
      children,
      className = "",
      style,
      viewportGroupRef,
      readonly,
      elementsShared,
      ...props
    },
    ref,
  ) => {
    const elements = useBoardStore((s) => s.elements);
    const currentElement = useBoardStore((s) => s.currentElement);

    return (
      <svg
        ref={ref}
        className={`fixed inset-0 h-full w-full touch-none select-none  ${className}`}
        style={style}
        {...props}
      >
        <g ref={viewportGroupRef} transform="translate(0 0) scale(1)">
          {/* Persistent board elements */}
          {readonly ? (
            elementsShared?.map((element) => (
              <ElementRenderer key={element.id} element={element} />
            ))
          ) : (
            elements.map((element) => (
              <ElementRenderer key={element.id} element={element} />
            ))
          )}

          {/* Current drawing */}
          {!readonly && currentElement && (
            <ElementRenderer element={currentElement} />
          )}

          {/* Selection */}
          {children}
        </g>
      </svg>
    );
  },
);

CanvasSvgLayer.displayName = "CanvasSvgLayer";
