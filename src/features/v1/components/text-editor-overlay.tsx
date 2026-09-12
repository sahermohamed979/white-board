"use client";

import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useBoardStore } from "../store/board-store";
import { generateId } from "../lib/id";
import type { TextElement } from "../types/element.types";

export interface TextEditorHandle {
  commitPending: () => void;
}

interface TextEditorInstanceProps {
  x: number;
  y: number;
  onClose: () => void;
  ref?: React.Ref<TextEditorHandle>;
}

function TextEditorInstance({ x, y, onClose, ref }: TextEditorInstanceProps) {
  const addElement = useBoardStore((s) => s.addElement);
  const strokeColor = useBoardStore((s) => s.strokeColor);
  const fontSize = useBoardStore((s) => s.fontSize);
  const setActiveTool = useBoardStore((s) => s.setActiveTool);

  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const justCommittedRef = useRef(false);
  const currentFontSize = fontSize ?? 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const commit = () => {
    if (justCommittedRef.current) return;
    justCommittedRef.current = true;

    const trimmed = text.trim();
    if (trimmed.length > 0) {
      const newEl: TextElement = {
        id: generateId(),
        type: "text",
        x,
        y,
        text: trimmed,
        fontSize: currentFontSize,
        color: strokeColor || "#1e1e1e",
      };
      addElement(newEl);
      setActiveTool("select");
    }
  };

  useImperativeHandle(ref, () => ({ commitPending: commit }));

  const handleBlur = () => {
    const wasAlreadyCommitted = justCommittedRef.current;
    commit();
    if (!wasAlreadyCommitted) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commit();
      onClose();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      justCommittedRef.current = true;
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
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Type something..."
        rows={Math.max(text.split("\n").length, 1)}
        className="min-h-8 min-w-35 resize-none overflow-hidden rounded px-2 py-1 font-sans leading-snug text-gray-900 shadow-xl outline-none"
        style={{
          color: strokeColor || "#1e1e1e",
          fontSize: `${currentFontSize}px`,
        }}
      />
    </div>
  );
}

interface TextEditorOverlayProps {
  placement: [number, number] | null;
  onClose: () => void;
  ref?: React.Ref<TextEditorHandle>;
}

export function TextEditorOverlay({
  placement,
  onClose,
  ref,
}: TextEditorOverlayProps) {
  const instanceRef = useRef<TextEditorHandle>(null);

  useImperativeHandle(ref, () => ({
    commitPending: () => instanceRef.current?.commitPending(),
  }));

  if (!placement) return null;
  const [x, y] = placement;

  return (
    <TextEditorInstance
      key={`${x}-${y}`}
      ref={instanceRef}
      x={x}
      y={y}
      onClose={onClose}
    />
  );
}

export default TextEditorOverlay;
