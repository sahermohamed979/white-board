import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/src/features/v2/api/supabase-server";
import {
  shareBoardDataSchema,
  shareTokenSchema,
} from "@/src/features/v1/schema/share.schema";
import type {
  ShareApiResponse,
  SharedBoardData,
} from "@/src/features/v1/types/share.types";
import { ShareBoardRecord } from "@/src/shared/types/response-types";

function errorResponse(
  message: string,
  code: number,
): NextResponse<ShareApiResponse> {
  return NextResponse.json({ status: false, message, code }, { status: code });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse<ShareApiResponse>> {
  const { token } = await params;
  const parsedToken = shareTokenSchema.safeParse(token);

  if (!parsedToken.success) {
    return errorResponse("Invalid share token", 400);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("board_shares")
      .select("data, expires_at")
      .eq("token", parsedToken.data)
      .maybeSingle();

    if (error) return errorResponse("Unable to load shared board", 500);
    if (!data) return errorResponse("Share link not found", 404);

    const record = data as ShareBoardRecord;
    const expiresAt = Date.parse(record.expires_at);
    if (!Number.isFinite(expiresAt)) {
      return errorResponse("Unable to load shared board", 500);
    }
    if (expiresAt <= Date.now()) {
      return errorResponse("This share link has expired", 410);
    }

    const parsedData = shareBoardDataSchema.safeParse(record.data);
    if (!parsedData.success) {
      return errorResponse("Shared board data is invalid", 500);
    }

    const boardData: SharedBoardData = {
      elements: parsedData.data.elements,
      backgroundColor: parsedData.data.backgroundColor ?? "bg-background",
      backgroundGrid: parsedData.data.backgroundGrid ?? "none",
    };

    return NextResponse.json({
      status: true,
      payload: { data: boardData, expiresAt },
    });
  } catch {
    return errorResponse("Unable to load shared board", 500);
  }
}
