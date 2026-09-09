"use client";

import React, { useEffect, useRef, useState } from "react";
import { useBoardStore } from "../store/board-store";
import { generateId } from "../lib/id";
import type { TextElement } from "../types/element.types";

interface TextEditorOverlayProps {
  placement: [number, number] | null;
  onClose: () => void;
}

export function TextEditorOverlay({
  placement,
  onClose,
}: TextEditorOverlayProps) {
  const addElement = useBoardStore((s) => s.addElement);
  const strokeColor = useBoardStore((s) => s.strokeColor);
  const setActiveTool = useBoardStore((s) => s.setActiveTool);

  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    if (placement) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText("");

      isReadyRef.current = false;

      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();

          isReadyRef.current = true;
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [placement]);

  if (!placement) return null;

  const [x, y] = placement;

  const handleCommit = () => {
    if (!isReadyRef.current) return;
    const trimmed = text.trim();
    if (trimmed.length > 0) {
      const newEl: TextElement = {
        id: generateId(),
        type: "text",
        x,
        y,
        text: trimmed,
        fontSize: 20,
        color: strokeColor || "#1e1e1e",
      };
      addElement(newEl);
      setActiveTool("select");
    }

    setText("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommit();
    } else if (e.key === "Escape") {
      setText("");
      onClose();
    }
  };

  return (
    <div
      className="absolute z-50"
      style={{ left: `${x}px`, top: `${y}px` }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        placeholder="Type something..."
        rows={Math.max(text.split("\n").length, 1)}
        className="min-h-8 min-w-35 resize-none overflow-hidden rounded border-2 border-blue-500 bg-white/95 px-2 py-1 font-sans text-base leading-snug text-gray-900 shadow-xl outline-none"
        style={{ color: strokeColor || "#1e1e1e" }}
      />
    </div>
  );
}
