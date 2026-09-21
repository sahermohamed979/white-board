"use client";

import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/shared/components/ui/dialog";

export interface EndSessionDialogProps {
  open: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function EndSessionDialog({
  open,
  isPending,
  onConfirm,
  onClose,
}: EndSessionDialogProps) {
  const t = useTranslations("main.session");

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md rounded-2xl p-6 text-center flex flex-col items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-6" />
        </div>

        <DialogHeader className="items-center gap-2">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {t("endSessionQuestion")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {t("endSessionDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex w-full items-center justify-center gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-11"
            disabled={isPending}
            onClick={onClose}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            className="flex-1 rounded-xl h-11 text-white gap-2 font-medium"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{t("endingSession")}</span>
              </>
            ) : (
              <span>{t("endSession")}</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EndSessionDialog;
