"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { useBoardStore } from "../store/board-store";

export function useKeyboardShortcuts() {
  const setActiveTool = useBoardStore((s) => s.setActiveTool);
  const selectedIds = useBoardStore((s) => s.selectedIds);
  const deleteElements = useBoardStore((s) => s.deleteElements);
  const setSelectedIds = useBoardStore((s) => s.setSelectedIds);

  // Tool shortcuts
  useHotkeys("v", () => setActiveTool("select"), { preventDefault: true });
  useHotkeys("p", () => setActiveTool("pen"), { preventDefault: true });
  useHotkeys("r", () => setActiveTool("rectangle"), { preventDefault: true });
  useHotkeys("o", () => setActiveTool("circle"), { preventDefault: true });
  useHotkeys("a", () => setActiveTool("arrow"), { preventDefault: true });
  useHotkeys("t", () => setActiveTool("text"), { preventDefault: true });
  useHotkeys("e", () => setActiveTool("eraser"), { preventDefault: true });

  // Delete selected elements
  useHotkeys(
    ["delete", "backspace"],
    () => {
      if (selectedIds.length > 0) {
        deleteElements(selectedIds);
      }
    },
    { preventDefault: true },
    [selectedIds, deleteElements]
  );

  // Select all elements
  useHotkeys(
    ["ctrl+a", "meta+a"],
    (e) => {
      e.preventDefault();
      const allIds = useBoardStore.getState().elements.map((el) => el.id);
      setSelectedIds(allIds);
    },
    { preventDefault: true },
    [setSelectedIds]
  );
}
