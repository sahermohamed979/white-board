"use client";

import { Play, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/src/shared/components/ui/button";

export interface StartSessionButtonProps {
  onStart: () => void;
  isPending: boolean;
  disabled?: boolean;
}

export function StartSessionButton({
  onStart,
  isPending,
  disabled = false,
}: StartSessionButtonProps) {
  const t = useTranslations("main.session");

  return (
    <Button
      className="h-12 gap-3 px-6 text-sm sm:text-base text-white rounded-xl shadow transition-all hover:opacity-95"
      disabled={isPending || disabled}
      onClick={onStart}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>{t("startingSession") || "Starting session..."}</span>
        </>
      ) : (
        <>
          <Play className="size-4 fill-current" />
          <span>{t("startSession") || "Start session"}</span>
        </>
      )}
    </Button>
  );
}

export default StartSessionButton;
