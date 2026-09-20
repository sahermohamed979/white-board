import { z } from "zod";
import { elementSchema } from "@/src/features/v1/schema/share.schema";

/* ==============================================
   Zod Schemas for Incoming Realtime Broadcasts
============================================== */

export const elementCreateEventSchema = z.object({
  operationId: z.string().uuid(),
  boardId: z.string().uuid(),
  participantId: z.string().uuid(),
  timestamp: z.number().finite().nonnegative(),
  element: elementSchema,
});

export const elementUpdateEventSchema = z.object({
  operationId: z.string().uuid(),
  boardId: z.string().uuid(),
  participantId: z.string().uuid(),
  timestamp: z.number().finite().nonnegative(),
  element: elementSchema,
});

export const elementDeleteEventSchema = z.object({
  operationId: z.string().uuid(),
  boardId: z.string().uuid(),
  participantId: z.string().uuid(),
  timestamp: z.number().finite().nonnegative(),
  elementId: z.string().min(1),
});

export const sessionEndEventSchema = z.object({
  sessionId: z.string().uuid(),
  timestamp: z.number().finite().nonnegative(),
});

export const endSessionRequestSchema = z
  .object({
    sessionId: z.string().uuid("Invalid session ID format"),
  })
  .strict();
