"use client";

import { useEffect, useState } from "react";
import { useBoardStore } from "../store/board-store";
import { getAllElements, saveAllElements } from "../db/board-db";

export function usePersistedBoard() {
  const elements = useBoardStore((s) => s.elements);
  const setElements = useBoardStore((s) => s.setElements);
  const [isHydrated, setIsHydrated] = useState(false); // ← state بدل ref

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const saved = await getAllElements();
        if (!cancelled && saved && saved.length > 0) {
          setElements(saved);
        }
      } catch (err) {
        console.error("Failed to load elements from DB:", err);
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, [setElements]);

  useEffect(() => {
    if (!isHydrated) return; // ← الحفظ بيستنى الـ hydration الحقيقي

    const timer = setTimeout(() => {
      saveAllElements(elements).catch((err) => {
        console.error("Failed to persist elements to DB:", err);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [elements, isHydrated]);

  return { isHydrated }; // ← رجّعها عشان تقدر تمنع رفع صور قبل ما تخلص
}