"use client";

import { useState } from "react";
import { Check, Copy, Radio } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/shared/components/ui/dialog";

export interface SessionShareDialogProps {
  open: boolean;
  url: string;
  onClose: () => void;
  expiresAt?: number;
}

export function SessionShareDialog({
  open,
  url,
  onClose,
  expiresAt,
}: SessionShareDialogProps) {
  const t = useTranslations("main.session");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="md:max-w-xl w-[95vw] sm:w-full gap-0 rounded-2xl p-6 text-center flex flex-col items-center">
        <DialogHeader className="items-center gap-3 w-full">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Radio className="size-6 animate-pulse" />
          </div>
          <DialogTitle className="text-xl font-semibold text-primary sm:text-2xl">
            {t("sessionStarted") || "Session Started"}
          </DialogTitle>
          <DialogDescription className="max-w-md text-sm leading-6 text-foreground/80 sm:text-base">
            {t("invitePeopleToCollaborate") ||
              "Share this link with others to collaborate live on your whiteboard."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 w-full space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={url}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="h-12 flex-1 rounded-xl bg-muted/50 px-4 text-sm font-mono text-foreground select-all"
            />
            <Button
              onClick={handleCopy}
              className="h-12 gap-2 px-5 rounded-xl font-medium text-white transition-all"
              variant={copied ? "default" : "default"}
            >
              {copied ? (
                <>
                  <Check className="size-4 text-emerald-400" />
                  <span>{t("linkCopied") || "Copied!"}</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>{t("Copylink") || "Copy"}</span>
                </>
              )}
            </Button>
          </div>

          {expiresAt && (
            <p className="text-xs text-muted-foreground text-center">
              ⏳ {t("thisLinkWillExpireIn") || "This session expires in 30 minutes"}
            </p>
          )}
        </div>

        <div className="mt-6 flex w-full justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-5"
          >
            {t("close") || "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SessionShareDialog;
