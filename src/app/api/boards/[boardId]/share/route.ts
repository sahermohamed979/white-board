import { NextRequest, NextResponse } from "next/server";

import {
  boardIdSchema,
  createShareRequestSchema,
} from "@/src/features/v1/schema/share.schema";
import { createSupabaseServerClient } from "@/src/features/v2/api/supabase-server";
import { routing } from "@/src/i18n/routing";
import { ApiResponse, CreateShareRecord } from "@/src/shared/types/response-types";
import { ShareLinkPayload } from "@/src/features/v1/types/share.types";

function errorResponse(
  message: string,
  code: number,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ status: false, message, code }, { status: code });
}

function getLocale(request: NextRequest): string | null {
  const localeHeader = request.headers.get("x-next-intl-locale");
  if (
    localeHeader &&
    routing.locales.includes(localeHeader as (typeof routing.locales)[number])
  ) {
    return localeHeader;
  }

  const referer = request.headers.get("referer");
  if (!referer) return null;

  try {
    const pathname = new URL(referer).pathname;
    const locale = pathname.split("/")[1];
    return routing.locales.includes(locale as (typeof routing.locales)[number])
      ? locale
      : null;
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> },
): Promise<NextResponse<ApiResponse<ShareLinkPayload>>> {
  const { boardId } = await params;
  const parsedBoardId = boardIdSchema.safeParse(boardId);

  if (!parsedBoardId.success) {
    return errorResponse("Invalid board ID", 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const parsedBody = createShareRequestSchema.safeParse(body);
  if (!parsedBody.success) {
    return errorResponse("Request body contains invalid board data", 400);
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (err) {
    console.error("Supabase client creation failed:", err);
    return errorResponse("Share service is not configured", 500);
  }

  const { error: boardUpsertError } = await supabase.from("boards").upsert(
    {
      id: parsedBoardId.data,
      name: "Shared board",
      data: parsedBody.data.data,
    },
    { onConflict: "id" },
  );

  if (boardUpsertError) {
    console.error("Board upsert error:", boardUpsertError);
    return errorResponse("Unable to prepare board for sharing", 500);
  }

  const { data, error } = await supabase.rpc("create_or_refresh_share", {
    p_board_id: parsedBoardId.data,
    p_data: parsedBody.data.data,
  });

  if (error) {
    console.error("Supabase RPC error:", error);
    return errorResponse("Unable to create share link", 500);
  }

  const share = Array.isArray(data) ? data[0] : data;
  if (!share || typeof share !== "object") {
    return errorResponse("Unable to create share link", 500);
  }

  const record = share as Partial<CreateShareRecord>;
  if (!record.token || !record.expires_at) {
    return errorResponse("Unable to create share link", 500);
  }

  const expiresAt = Date.parse(record.expires_at);
  if (!Number.isFinite(expiresAt)) {
    return errorResponse("Unable to create share link", 500);
  }

  const locale = getLocale(request);
  const sharePath = locale
    ? `/${locale}/share/${encodeURIComponent(record.token)}`
    : `/share/${encodeURIComponent(record.token)}`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.url;

  return NextResponse.json({
    status: true,
    message: "Share link created",
    payload: {
      url: new URL(sharePath, baseUrl).toString(),
      expiresAt,
    },
  });
}
