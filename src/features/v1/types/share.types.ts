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
export interface CreateShareLinkResponse {
  status: true;
  message?: string;
  code?: number;
  payload: ShareLinkPayload;
}

export interface ShareErrorResponse {
  status: false;
  message: string;
  code?: number;
}

export type CreateShareLinkApiResponse =
  | CreateShareLinkResponse
  | ShareErrorResponse;


/* =========================
   Get Shared Board
========================= */

export interface ShareResponse {
  status: true;
  payload: {
    data: SharedBoardData;
    expiresAt: number;
  };
}

export type ShareApiResponse =
  | ShareResponse
  | ShareErrorResponse;