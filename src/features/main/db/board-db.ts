import Dexie, { type Table } from "dexie";
import type { Element } from "../types/element.types";

export class BoardDatabase extends Dexie {
  elements!: Table<Element, string>;

  constructor() {
    super("BoardDatabase");
    this.version(1).stores({
      elements: "id, type",
    });
  }
}

export const db = new BoardDatabase();

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
