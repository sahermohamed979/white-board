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

export const participantPresenceSchema = z.object({
  participantId: z.string().uuid(),
  color: z.enum([
    "#EF4444",
    "#3B82F6",
    "#22C55E",
    "#A855F7",
    "#F97316",
    "#06B6D4",
    "#EAB308",
    "#EC4899",
    "#14B8A6",
    "#8B5CF6",
  ]),
  cursor: z
    .object({
      x: z.number().finite(),
      y: z.number().finite(),
    })
    .nullable(),
  joinedAt: z.number().finite().nonnegative(),
  name: z.string().min(1).max(80).optional(),
  isOwner: z.boolean().optional(),
});

export const endSessionRequestSchema = z
  .object({
    sessionId: z.string().uuid("Invalid session ID format"),
  })
  .strict();
