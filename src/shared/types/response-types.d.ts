interface ErrorResponse {
  status: false;
  message: string;
  code?: number;
}

interface SuccessResponse<T> {
  status: true;
  message?: string;
  code?: number;
  payload: T;
}

interface ShareRecord {
  data: unknown;
  expires_at: string;
}
interface ShareLinkPayload {
  url: string;
  expiresAt: number;
}
interface ShareRecord {
  token: string;
  expires_at: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
