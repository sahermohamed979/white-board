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

export const drawingStreamEventSchema = z.object({
  participantId: z.string().uuid(),
  boardId: z.string().uuid(),
  timestamp: z.number().finite().nonnegative(),
  element: elementSchema,
});

export const drawingEndEventSchema = z.object({
  participantId: z.string().uuid(),
  boardId: z.string().uuid(),
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
  style: z
    .object({
      strokeColor: z.string().min(1),
      strokeWidth: z.number().finite().positive(),
    })
    .optional(),
});

export const endSessionRequestSchema = z
  .object({
    sessionId: z.string().uuid("Invalid session ID format"),
  })
  .strict();
