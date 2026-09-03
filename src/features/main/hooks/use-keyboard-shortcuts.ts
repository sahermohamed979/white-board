"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { useBoardStore } from "../store/board-store";

export function useKeyboardShortcuts() {
  const setActiveTool = useBoardStore((s) => s.setActiveTool);
  const activeTool = useBoardStore((s) => s.activeTool);
  const selectedIds = useBoardStore((s) => s.selectedIds);
  const deleteElements = useBoardStore((s) => s.deleteElements);
  const setSelectedIds = useBoardStore((s) => s.setSelectedIds);

  const hotkeyOptions = { preventDefault: true, enableOnFormTags: false };

  useHotkeys(
    "v",
    () => activeTool !== "text" && setActiveTool("select"),
    hotkeyOptions,
  );
  useHotkeys(
    "p",
    () => activeTool !== "text" && setActiveTool("pen"),
    hotkeyOptions,
  );
  useHotkeys(
    "r",
    () => activeTool !== "text" && setActiveTool("rectangle"),
    hotkeyOptions,
  );
  useHotkeys(
    "o",
    () => activeTool !== "text" && setActiveTool("circle"),
    hotkeyOptions,
  );
  useHotkeys(
    "a",
    () => activeTool !== "text" && setActiveTool("arrow"),
    hotkeyOptions,
  );
  useHotkeys("t", () => setActiveTool("text"), hotkeyOptions); // ← دي نفسها بتفعّل أداة الكتابة، مش لازم شرط
  useHotkeys(
    "e",
    () => activeTool !== "text" && setActiveTool("eraser"),
    hotkeyOptions,
  );

  // Delete selected elements
  useHotkeys(
    ["delete", "backspace"],
    () => {
      if (selectedIds.length > 0) {
        deleteElements(selectedIds);
      }
    },
    hotkeyOptions,
    [selectedIds, deleteElements],
  );

  // Select all elements
  useHotkeys(
    ["ctrl+a", "meta+a"],
    (e) => {
      e.preventDefault();
      const allIds = useBoardStore.getState().elements.map((el) => el.id);
      setSelectedIds(allIds);
    },
    hotkeyOptions,
    [setSelectedIds],
  );

  // Undo / Redo
  useHotkeys(
    ["ctrl+z", "meta+z"],
    () => useBoardStore.temporal.getState().undo(),
    hotkeyOptions,
  );
  useHotkeys(
    ["ctrl+y", "meta+y", "ctrl+shift+z", "meta+shift+z"],
    () => useBoardStore.temporal.getState().redo(),
    hotkeyOptions,
  );
}
