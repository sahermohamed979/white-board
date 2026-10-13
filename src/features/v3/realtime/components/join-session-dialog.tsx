"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";
import { Input } from "@/src/shared/components/ui/input";

import { cn } from "@/src/shared/lib/utils";

interface JoinSessionDialogProps {
  open: boolean;
  onJoin: (name: string) => void;
  onClose?: () => void;
}

export function JoinSessionDialog({
  open,
  onJoin,
  onClose,
}: JoinSessionDialogProps) {
  // Translation
  const t = useTranslations("main.session");

  // State
  const [name, setName] = useState("");

  // Variables
  const isNameValid = name.trim().length > 0 && name.trim().length <= 80;

  // Functions
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (isNameValid) onJoin(name.trim());
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t("joinSessionTitle")}</DialogTitle>
          <DialogDescription>{t("chooseDisplayName")}</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            value={name}
            maxLength={80}
            placeholder={t("yourName")}
            onChange={(event) => setName(event.target.value)}
          />
          <div className="flex gap-2">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                {t("cancel")}
              </Button>
            )}
            <Button
              className={cn("text-white", onClose ? "flex-1" : "w-full")}
              disabled={!isNameValid}
              type="submit"
            >
              {t("joinSession")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
