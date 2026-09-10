export interface ErrorResponse {
  status: false;
  message: string;
  code?: number;
}

export interface SuccessResponse<T> {
  status: true;
  message?: string;
  code?: number;
  payload: T;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/* صف الجدول اللي بيترجع من SELECT وقت قراءة الـ share (GET) */
export interface ShareBoardRecord {
  data: unknown;
  expires_at: string;
}

/* صف الجدول اللي بيترجع من الـ RPC وقت إنشاء/تجديد الـ share (POST) */
export interface CreateShareRecord {
  token: string;
  expires_at: string;
}
