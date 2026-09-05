"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/shared/components/ui/dropdown-menu";
import { Button } from "@/src/shared/components/ui/button";
import { Pipette } from "lucide-react";
import { EditableInput, Sketch } from "@uiw/react-color";
import { useDebounce } from "use-debounce";

function getContrastColor(hex: string): string {
  if (!hex || hex === "transparent") return "text-foreground";

  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (cleanHex.length !== 6) return "text-foreground";

  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  // Perceived brightness formula (YIQ/HSP)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 145 ? "text-zinc-900" : "text-white";
}

export default function ColorPicker({
  currentStrokeColor,
  handleStrokeColorChange,
}: {
  currentStrokeColor: string;
  handleStrokeColorChange: (color: string) => void;
}) {
  const [debouncedColor] = useDebounce(currentStrokeColor, 500);
  const iconColor = getContrastColor(currentStrokeColor);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            className="h-6 w-6 cursor-pointer rounded-full border border-border p-0 transition-transform hover:scale-105"
            style={{ backgroundColor: currentStrokeColor }}
          />
        }
      >
        <Pipette size={14} className={iconColor} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="right"
        className="w-auto p-0 border-0 bg-card"
      >
        <Sketch
          color={currentStrokeColor}
          onChange={(color) => handleStrokeColorChange(color.hex)}
        />
        <div
          className="px-2 py-1 bg-card border-t border-border"
          onKeyDown={(e) => e.stopPropagation()}
        >
          <EditableInput
            label="#"
            placement="left"
            value={debouncedColor.replace(/^#/, "")}
            labelStyle={{
              color: "hsl(var(--muted-foreground))",
              fontWeight: 600,
              fontSize: "13px",
              marginRight: "4px",
              userSelect: "none",
            }}
            inputStyle={{
              color: "hsl(var(--foreground))",
              fontFamily: "monospace",
              textTransform: "uppercase",
              fontSize: "12px",
              padding: "4px 6px",
              borderRadius: "6px",
              border: "1px solid hsl(var(--border))",
              boxShadow: "none",
              backgroundColor: "hsl(var(--background))",
            }}
            onChange={(e, val) => {
              const raw =
                typeof val === "string" ? val : e?.target?.value || "";
              const hex = raw.replace(/^#/, "").trim();

              if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
                handleStrokeColorChange(`#${hex}`);
              } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
                handleStrokeColorChange(
                  `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`,
                );
              }
            }}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
