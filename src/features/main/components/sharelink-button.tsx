import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/shared/components/ui/dialog";
import React from "react";

export default function ShareLinkButton() {
  return (
    <DialogContent className="md:max-w-xl w-screen h-fit gap-0 rounded-2xl p-6 text-center ">
      <DialogHeader className="items-center gap-3">
        <DialogTitle className="text-xl font-semibold text-primary sm:text-2xl">
Shareable link
        </DialogTitle>
        <DialogDescription className="max-w-md text-sm leading-6 text-foreground/80 sm:text-base">
          Invite people to collaborate on your drawing.
        </DialogDescription>
        <span className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          Your session is protected with end-to-end encryption, ensuring that
          your work remains completely private. Your drawings are accessible
          only to you and the people you choose to share them with — not even
          our servers can view or access your content.
        </span>
      </DialogHeader>
    </DialogContent>
  );
}
