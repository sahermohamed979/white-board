import { z } from "zod";

const pointSchema = z.tuple([z.number(), z.number(), z.number()]);
const baseElementSchema = z.object({ id: z.string().min(1) });

export const elementSchema = z.discriminatedUnion("type", [
  baseElementSchema.extend({ type: z.literal("hand") }),
  baseElementSchema.extend({
    type: z.literal("straightLine"),
    x1: z.number(),
    y1: z.number(),
    x2: z.number(),
    y2: z.number(),
    strokeColor: z.string(),
    strokeWidth: z.number(),
    strokeStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
    roughness: z.number().optional(),
  }),
  baseElementSchema.extend({
    type: z.enum(["diamond", "rectangle", "circle"]),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    strokeColor: z.string(),
    fillColor: z.string().optional(),
    strokeWidth: z.number(),
    strokeStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
    fillStyle: z.enum(["none", "hachure", "solid", "cross-hatch"]).optional(),
    roughness: z.number().optional(),
  }),
  baseElementSchema.extend({
    type: z.literal("freehand"),
    points: z.array(pointSchema),
    color: z.string(),
    size: z.number(),
    strokeColor: z.string().optional(),
    strokeWidth: z.number().optional(),
    strokeStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
  }),
  baseElementSchema.extend({
    type: z.literal("arrow"),
    points: z.tuple([pointSchema, pointSchema]),
    strokeColor: z.string(),
    strokeWidth: z.number(),
    strokeStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
  }),
  baseElementSchema.extend({
    type: z.literal("text"),
    x: z.number(),
    y: z.number(),
    text: z.string(),
    fontSize: z.number(),
    color: z.string(),
    strokeColor: z.string().optional(),
    fontFamily: z.enum(["handwritten", "sans", "mono"]).optional(),
    textAlign: z.enum(["left", "center", "right"]).optional(),
  }),
  baseElementSchema.extend({
    type: z.literal("image"),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    src: z.string().min(1),
  }),
]);

export const shareDataSchema = z.array(elementSchema);
export const shareBoardDataSchema = z.object({
  elements: shareDataSchema,
  backgroundColor: z.string().optional(),
  backgroundGrid: z.string().optional(),
});
export const createShareRequestSchema = z
  .object({ data: shareBoardDataSchema })
  .strict();
export const shareTokenSchema = z.string().min(1).max(512);

export const boardIdSchema = z
  .string()
  .min(1)
  .max(36)
  .regex(/^[A-Za-z0-9_-]+$/, "Invalid board ID format");
export const sharedBoardResponseSchema = z.object({
  data: shareBoardDataSchema,
  expiresAt: z.number(),
});
export type Element = z.infer<typeof elementSchema>;
export type SharedBoardData = z.infer<typeof shareBoardDataSchema>;
export type SharedBoardResponse = z.infer<typeof sharedBoardResponseSchema>;
