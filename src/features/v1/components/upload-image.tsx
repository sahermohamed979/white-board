"use client";

import { useRef } from "react";
import { ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { imageSchema } from "../schema/image.schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/shared/components/ui/tooltip";
import { Button } from "@/src/shared/components/ui/button";

interface UploadImageProps {
  onImageSelect: (file: File) => void;
}

type ImageFormValues = {
  image: File | null;
};

export default function UploadImage({ onImageSelect }: UploadImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      image: null,
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) return;

    setValue("image", file, {
      shouldValidate: true,
    });

    const isValid = await trigger("image");

    if (!isValid) {
      e.target.value = "";
      return;
    }

    onImageSelect(file);

    e.target.value = "";
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="outline"
              aria-label="Upload image"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="h-5 w-5" />
            </Button>
          }
        >
        </TooltipTrigger>
        <TooltipContent>
          <span className="capitalize">image</span>
        </TooltipContent>
      </Tooltip>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageChange}
      />

      {errors.image?.message && (
        <p className="absolute top-full mt-2 text-sm text-red-500">
          {String(errors.image.message)}
        </p>
      )}
    </>
  );
}
