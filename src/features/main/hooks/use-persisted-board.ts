"use client";

import { useEffect, useRef } from "react";
import { useBoardStore } from "../store/board-store";
import { getAllElements, saveAllElements } from "../db/board-db";

export function usePersistedBoard() {
  const elements = useBoardStore((s) => s.elements);
  const setElements = useBoardStore((s) => s.setElements);
  const isHydratedRef = useRef(false);

  // Initial load from Dexie
  useEffect(() => {
    async function loadInitial() {
      try {
        const saved = await getAllElements();
        if (saved && saved.length > 0) {
          setElements(saved);
        }
      } catch (err) {
        console.error("Failed to load elements from DB:", err);
      } finally {
        isHydratedRef.current = true;
      }
    }

    loadInitial();
  }, [setElements]);

  // Debounced auto-save to Dexie on elements change
  useEffect(() => {
    if (!isHydratedRef.current) return;

    const timer = setTimeout(() => {
      saveAllElements(elements).catch((err) => {
        console.error("Failed to persist elements to DB:", err);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [elements]);
}
