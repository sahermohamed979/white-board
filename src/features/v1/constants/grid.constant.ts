import type React from "react";

export const GRID_LINE_COLOR = "var(--border)";

export const GRID_STYLE_MAP: Record<string, React.CSSProperties> = {
  none: {},
  "small-grid": {
    backgroundImage: `linear-gradient(${GRID_LINE_COLOR} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE_COLOR} 1px, transparent 1px)`,
    backgroundSize: "20px 20px",
  },
  "large-grid": {
    backgroundImage: `linear-gradient(${GRID_LINE_COLOR} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE_COLOR} 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
  },
  dots: {
    backgroundImage: `radial-gradient(${GRID_LINE_COLOR} 1.5px, transparent 1.5px)`,
    backgroundSize: "20px 20px",
  },
  lines: {
    backgroundImage: `linear-gradient(${GRID_LINE_COLOR} 1px, transparent 1px)`,
    backgroundSize: "100% 24px",
  },
};

export const gridStyleMap = GRID_STYLE_MAP;

export interface BackgroundGridOption {
  id: string;
  className: string;
  style: React.CSSProperties;
}

export const BACKGROUNDS_GRIDS: BackgroundGridOption[] = [
  {
    id: "none",
    className: "bg-bg-0",
    style: {},
  },
  {
    id: "small-grid",
    className: "bg-bg-1",
    style: {
      backgroundImage: `linear-gradient(${GRID_LINE_COLOR} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE_COLOR} 1px, transparent 1px)`,
      backgroundSize: "6px 6px",
    },
  },
  {
    id: "large-grid",
    className: "bg-bg-2",
    style: {
      backgroundImage: `linear-gradient(${GRID_LINE_COLOR} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE_COLOR} 1px, transparent 1px)`,
      backgroundSize: "10px 10px",
    },
  },
  {
    id: "dots",
    className: "bg-bg-3",
    style: {
      backgroundImage: `radial-gradient(${GRID_LINE_COLOR} 1px, transparent 1px)`,
      backgroundSize: "8px 8px",
    },
  },
  {
    id: "lines",
    className: "bg-bg-4",
    style: {
      backgroundImage: `linear-gradient(${GRID_LINE_COLOR} 1px, transparent 1px)`,
      backgroundSize: "100% 8px",
    },
  },
];

export const backgroundsGrids = BACKGROUNDS_GRIDS;

