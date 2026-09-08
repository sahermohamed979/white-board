import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/shared/components/ui/dialog";
import React from "react";
import { ClipboardButton } from "./clipboard";

export default function ShareLinkButton() {
  return (
    <DialogContent className="md:max-w-xl w-screen h-fit gap-0 rounded-2xl p-6 text-center flex flex-col items-center gap-6">
      <DialogHeader className="items-center gap-3">
        <DialogTitle className="text-xl font-semibold text-primary sm:text-2xl">
          Shareable link
        </DialogTitle>
      </DialogHeader>
      <ClipboardButton />
      <DialogDescription className="text-sm leading-6 text-foreground/80 md:text-base flex flex-col gap-4">
        🔒 End-to-end encrypted. Your upload is encrypted before it leaves your
        device, so Sketchly servers and third parties cannot access its
        contents.
        <span className="text-destructive">
          ⚠️ This link will expire in 1 hours
        </span>
      </DialogDescription>
    </DialogContent>
  );
}
