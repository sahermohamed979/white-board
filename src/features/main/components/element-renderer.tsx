"use client";

import { memo } from "react";
import type { Element, FontFamily } from "../types/element.types";
import { getSvgPathFromPoints } from "../lib/freehand";
import {
  getRectangleSvgPaths,
  getEllipseSvgPaths,
  getArrowSvgPath,
  getDiamondSvgPaths,
  getStraightLineSvgPaths,
} from "../lib/shapes";
import Image from "next/image";

interface ElementRendererProps {
  element: Element;
}

function getFontFamilyCss(family?: FontFamily): string {
  switch (family) {
    case "handwritten":
      return "'Virgil', 'Caveat', 'Segoe Print', 'Comic Sans MS', cursive";
    case "mono":
      return "'Fira Code', 'Courier New', Courier, monospace";
    case "sans":
    default:
      return "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  }
}

function BaseElementRenderer({ element }: ElementRendererProps) {
  switch (element.type) {
    case "hand":
      return null;
    case "freehand": {
      const path = getSvgPathFromPoints(element.points, {
        size: element.strokeWidth ? element.strokeWidth * 3 : element.size || 6,
      });
      return (
        <path
          d={path}
          fill={element.strokeColor || element.color || "var(--primary)"}
        />
      );
    }
    case "straightLine": {
      const paths = getStraightLineSvgPaths(
        element.x1,
        element.y1,
        element.x2,
        element.y2,
        element.strokeColor || "var(--primary)",
        element.strokeWidth || 2,
        element.strokeStyle,
        element.roughness ?? 0,
      );
      return (
        <g>
          {paths.map((p, idx) => (
            <path
              key={idx}
              d={p.d}
              stroke={p.stroke}
              fill={p.fill || "none"}
              strokeWidth={p.strokeWidth || element.strokeWidth || 2}
              strokeDasharray={p.strokeLineDash?.join(" ")}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
      );
    }
    case "diamond": {
      const paths = getDiamondSvgPaths(
        element.x,
        element.y,
        element.width,
        element.height,
        element.strokeColor || "#1e1e1e",
        element.fillColor,
        element.strokeWidth || 2,
        element.strokeStyle,
        element.fillStyle,
        element.roughness ?? 0,
      );

      return (
        <g>
          {paths.map((p, idx) => (
            <path
              key={idx}
              d={p.d}
              stroke={p.stroke}
              fill={p.fill || "none"}
              strokeWidth={p.strokeWidth || element.strokeWidth || 2}
              strokeDasharray={p.strokeLineDash?.join(" ")}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
      );
    }

    case "rectangle": {
      const paths = getRectangleSvgPaths(
        element.x,
        element.y,
        element.width,
        element.height,
        element.strokeColor || "#1e1e1e",
        element.fillColor,
        element.strokeWidth || 2,
        element.strokeStyle,
        element.fillStyle,
        element.roughness ?? 0,
      );

      return (
        <g>
          {paths.map((p, idx) => (
            <path
              key={idx}
              d={p.d}
              stroke={p.stroke}
              fill={p.fill || "none"}
              strokeWidth={p.strokeWidth || element.strokeWidth || 2}
              strokeDasharray={p.strokeLineDash?.join(" ")}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
      );
    }

    case "circle": {
      const paths = getEllipseSvgPaths(
        element.x,
        element.y,
        element.width,
        element.height,
        element.strokeColor || "#1e1e1e",
        element.fillColor,
        element.strokeWidth || 2,
        element.strokeStyle,
        element.fillStyle,
        element.roughness ?? 0,
      );

      return (
        <g>
          {paths.map((p, idx) => (
            <path
              key={idx}
              d={p.d}
              stroke={p.stroke}
              fill={p.fill || "none"}
              strokeWidth={p.strokeWidth || element.strokeWidth || 2}
              strokeDasharray={p.strokeLineDash?.join(" ")}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
      );
    }

    case "arrow": {
      const d = getArrowSvgPath(element.points[0], element.points[1]);
      return (
        <path
          d={d}
          stroke={element.strokeColor || "#1e1e1e"}
          strokeWidth={element.strokeWidth || 2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }
    case "image": {
      return (
        <image
          href={element.src}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          preserveAspectRatio="xMidYMid meet"
        />
      );
    }
    case "text": {
      const lines = element.text.split("\n");
      const fontSize = element.fontSize || 20;
      const lineHeight = fontSize * 1.3;
      const fontFamily = getFontFamilyCss(element.fontFamily);
      const textAnchor =
        element.textAlign === "center"
          ? "middle"
          : element.textAlign === "right"
            ? "end"
            : "start";

      return (
        <text
          x={element.x}
          y={element.y + fontSize}
          fill={element.color || element.strokeColor || "#1e1e1e"}
          fontSize={fontSize}
          fontFamily={fontFamily}
          textAnchor={textAnchor}
          className="select-none font-medium"
        >
          {lines.map((line, i) => (
            <tspan key={i} x={element.x} dy={i === 0 ? 0 : lineHeight}>
              {line}
            </tspan>
          ))}
        </text>
      );
    }

    default:
      return null;
  }
}

export const ElementRenderer = memo(BaseElementRenderer);
