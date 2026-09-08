// lib/export.ts
import { toPng,  toJpeg , } from "html-to-image";

export async function exportBoardAsPng(
  svgElement: HTMLElement,
  filename = "board.png",
  backgroundColor?: string,
) {
  const dataUrl = await toPng(svgElement, {
    backgroundColor: backgroundColor || "#ffffff",
    pixelRatio: 2, 
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
export async function exportBoardAsJpeg(
  svgElement: HTMLElement,
  filename = "board.jpeg",
  backgroundColor?: string,
) {
  const dataUrl = await toJpeg(svgElement, {
    backgroundColor: backgroundColor || "#ffffff",
    pixelRatio: 2,
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
