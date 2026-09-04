"use client";

import { useEffect, useState } from "react";
import { useBoardStore } from "../store/board-store";
import {
  getAllElements,
  saveAllElements,
  getBoardSettings,
  saveBoardSettings,
} from "../db/board-db";

export function usePersistedBoard() {
  const elements = useBoardStore((s) => s.elements);
  const backgroundColor = useBoardStore((s) => s.backgroundColor);
  const backgroundGrid = useBoardStore((s) => s.backgroundGrid);

  const setElements = useBoardStore((s) => s.setElements);
  const setBackgroundColor = useBoardStore((s) => s.setBackgroundColor);
  const setBackgroundGrid = useBoardStore((s) => s.setBackgroundGrid);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const [savedElements, savedSettings] = await Promise.all([
          getAllElements(),
          getBoardSettings(),
        ]);

        if (!cancelled) {
          if (savedElements && savedElements.length > 0) {
            setElements(savedElements);
          }
          if (savedSettings) {
            if (savedSettings.backgroundColor) {
              setBackgroundColor(savedSettings.backgroundColor);
            }
            if (savedSettings.backgroundGrid) {
              setBackgroundGrid(savedSettings.backgroundGrid);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load data from DB:", err);
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, [setElements, setBackgroundColor, setBackgroundGrid]);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      saveAllElements(elements).catch((err) => {
        console.error("Failed to persist elements to DB:", err);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [elements, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      saveBoardSettings({ backgroundColor, backgroundGrid }).catch((err) => {
        console.error("Failed to persist board settings to DB:", err);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [backgroundColor, backgroundGrid, isHydrated]);

  return { isHydrated };
}