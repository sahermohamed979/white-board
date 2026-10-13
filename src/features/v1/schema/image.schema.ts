import { z } from "zod";
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const imageSchema = z.object({
  image: z
    .any()
    .transform((fileList) => fileList?.[0] || null)
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB",
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPG, PNG, WEBP images are allowed",
    ),
});

export type ImageInput = z.infer<typeof imageSchema>;
