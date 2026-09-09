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
  const boardId = useBoardStore((s) => s.currentBoardId);

  const setElements = useBoardStore((s) => s.setElements);
  const setBackgroundColor = useBoardStore((s) => s.setBackgroundColor);
  const setBackgroundGrid = useBoardStore((s) => s.setBackgroundGrid);
  const setCurrentBoardId = useBoardStore((s) => s.setCurrentBoardId);

  const [isHydrated, setIsHydrated] = useState(false);

  // تحميل البيانات المحفوظة عند أول تحميل
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

          // لو مفيش boardId محفوظ، نولّد UUID جديد وثابت لهذا الـ board
          setCurrentBoardId(savedSettings?.boardId ?? crypto.randomUUID());

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
  }, [setElements, setBackgroundColor, setBackgroundGrid, setCurrentBoardId]);

  // حفظ الـ elements (debounced)
  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      saveAllElements(elements).catch((err) => {
        console.error("Failed to persist elements to DB:", err);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [elements, isHydrated]);

  // حفظ فوري للـ boardId (بدون debounce) عشان نضمن ثباته من أول لحظة
  useEffect(() => {
    if (!isHydrated || !boardId) return;

    saveBoardSettings({ boardId, backgroundColor, backgroundGrid }).catch(
      (err) => {
        console.error("Failed to persist boardId to DB:", err);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, isHydrated]);

  // حفظ الـ background settings (debounced)
  useEffect(() => {
    if (!isHydrated || !boardId) return;

    const timer = setTimeout(() => {
      saveBoardSettings({ boardId, backgroundColor, backgroundGrid }).catch(
        (err) => {
          console.error("Failed to persist board settings to DB:", err);
        },
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [boardId, backgroundColor, backgroundGrid, isHydrated]);

  return { isHydrated };
}
