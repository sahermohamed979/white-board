"use client";
import Dexie, { type Table } from "dexie";
import type { Element } from "../types/element.types";

export interface BoardSettings {
  backgroundColor?: string;
  backgroundGrid?: string;
}

export class BoardDatabase extends Dexie {
  elements!: Table<Element, string>;
  settings!: Table<{ key: string; value: BoardSettings }, string>;

  constructor() {
    super("BoardDatabase");
    this.version(1).stores({
      elements: "id, type",
    });
    this.version(2).stores({
      elements: "id, type",
      settings: "key",
    });
  }
}

export const db = new BoardDatabase();

db.open().catch((err) => {
  console.error("Dexie failed to open:", err.name, err.message);
});
/**
 * Saves or updates a single element in IndexedDB.
 */
export async function saveElement(element: Element): Promise<void> {
  await db.elements.put(element);
}

/**
 * Bulk saves all elements in IndexedDB.
 */
export async function saveAllElements(elements: Element[]): Promise<void> {
  await db.transaction("rw", db.elements, async () => {
    await db.elements.clear();
    await db.elements.bulkPut(elements);
  });
}

/**
 * Retrieves all saved elements from IndexedDB.
 */
export async function getAllElements(): Promise<Element[]> {
  return await db.elements.toArray();
}

/**
 * Deletes elements by IDs from IndexedDB.
 */
export async function deleteElementsFromDb(ids: string[]): Promise<void> {
  await db.elements.bulkDelete(ids);
}

/**
 * Saves board settings (background color, grid) in IndexedDB.
 */
export async function saveBoardSettings(settings: BoardSettings): Promise<void> {
  await db.settings.put({ key: "boardSettings", value: settings });
}

/**
 * Retrieves board settings from IndexedDB.
 */
export async function getBoardSettings(): Promise<BoardSettings | undefined> {
  const entry = await db.settings.get("boardSettings");
  return entry?.value;
}
