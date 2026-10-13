import { create } from "zustand";
import type { RealtimeSession } from "../types/session.types";

/**
 * Zustand store for client-only realtime session UI state.
 * Server data remains managed by TanStack Query.
 */
interface RealtimeSessionStoreState {
  activeSession: RealtimeSession | null;
  setActiveSession: (session: RealtimeSession | null) => void;
  clearSession: () => void;
}

export const useRealtimeSessionStore = create<RealtimeSessionStoreState>(
  (set) => ({
    activeSession: null,
    setActiveSession: (session) => set({ activeSession: session }),
    clearSession: () => set({ activeSession: null }),
  }),
);
