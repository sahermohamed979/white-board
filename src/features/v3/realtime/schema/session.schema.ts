import { z } from "zod";
import { shareBoardDataSchema } from "@/src/features/v1/schema/share.schema";

/** Validates the POST body for creating a realtime session */
export const createSessionRequestSchema = z
  .object({
    boardId: z.string().uuid("Invalid board ID format"),
    board: shareBoardDataSchema,
  })
  .strict();

export type CreateSessionRequest = z.infer<
  typeof createSessionRequestSchema
>;

export const updateSessionSnapshotSchema = z
  .object({
    board: shareBoardDataSchema,
  })
  .strict();

/** Validates the session join token format */
export const joinTokenSchema = z
  .string()
  .min(1, "Token is required")
  .max(128, "Token is too long")
  .regex(/^[a-fA-F0-9]+$/, "Invalid session token format");

export type JoinToken = z.infer<typeof joinTokenSchema>;
