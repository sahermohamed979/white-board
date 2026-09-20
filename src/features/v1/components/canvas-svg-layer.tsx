"use client";

import React, { forwardRef } from "react";

import { useBoardStore } from "../store/board-store";
import { ElementRenderer } from "./element-renderer";

import type { Element } from "../types/element.types";

export interface CanvasSvgLayerProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
  viewportGroupRef?: React.RefObject<SVGGElement | null>;
  elementsShared?: Element[] | [];
  elements?: Element[];
  currentElement?: Element | null;
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
      elements: elementsProp,
      currentElement: currentElementProp,
      ...props
    },
    ref,
  ) => {
    const storeElements = useBoardStore((s) => s.elements);
    const storeCurrentElement = useBoardStore((s) => s.currentElement);

    const elementsToRender =
      elementsProp ?? (readonly ? elementsShared ?? [] : storeElements);
    const currentElementToRender =
      currentElementProp !== undefined
        ? currentElementProp
        : !readonly
          ? storeCurrentElement
          : null;

    return (
      <svg
        ref={ref}
        className={`fixed inset-0 h-full w-full touch-none select-none  ${className}`}
        style={style}
        {...props}
      >
        <g ref={viewportGroupRef} transform="translate(0 0) scale(1)">
          {/* Persistent board elements */}
          {elementsToRender.map((element) => (
            <ElementRenderer key={element.id} element={element} />
          ))}

          {/* Current drawing */}
          {currentElementToRender && (
            <ElementRenderer element={currentElementToRender} />
          )}

          {/* Selection */}
          {children}
        </g>
      </svg>
    );
  },
);

CanvasSvgLayer.displayName = "CanvasSvgLayer";
