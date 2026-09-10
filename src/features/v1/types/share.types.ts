import { ApiResponse } from "@/src/shared/types/response-types";
import type { Element } from "./element.types";

export interface SharedBoardData {
  elements: Element[];
  backgroundColor: string;
  backgroundGrid: string;
}

/* =========================
   Create Share Link
========================= */

export interface ShareLinkPayload {
  url: string;
  expiresAt: number;
}

export interface CreateShareLinkVariables {
  boardId: string;
  data: SharedBoardData;
}

export type CreateShareLinkApiResponse = ApiResponse<ShareLinkPayload>;

/* =========================
   Get Shared Board
========================= */

export interface SharedBoardPayload {
  data: SharedBoardData;
  expiresAt: number;
}

export type ShareApiResponse = ApiResponse<SharedBoardPayload>;
