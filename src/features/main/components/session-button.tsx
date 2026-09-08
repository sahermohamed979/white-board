"use client";

import { Link2, Play, Radio } from "lucide-react";

import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/shared/components/ui/dialog";
import { useState } from "react";
import ShareLinkButton from "./sharelink-button";

export default function SessionButton() {
  const [shareableLink, setShareableLink] = useState(false);
  const [started, setStarted] = useState(false);
  return (
    <div className="fixed top-4 right-4 z-2">
      <Dialog>
        <DialogTrigger
          render={
            <Button
              className="h-9 px-4 text-sm text-white"
              onClick={() => {
                setShareableLink(false);
              }}
            >
              <Radio /> live
            </Button>
          }
        />

        {shareableLink && <ShareLinkButton />}
        {!started && !shareableLink && (
          <DialogContent className="md:max-w-xl w-screen h-fit gap-0 rounded-2xl p-6 text-center ">
            <DialogHeader className="items-center gap-3">
              <DialogTitle className="text-xl font-semibold text-primary sm:text-2xl">
                Live collaboration
              </DialogTitle>
              <DialogDescription className="max-w-md text-sm leading-6 text-foreground/80 sm:text-base">
                Invite people to collaborate on your drawing.
              </DialogDescription>
              <span className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                Your session is protected with end-to-end encryption, ensuring
                that your work remains completely private. Your drawings are
                accessible only to you and the people you choose to share them
                with — not even our servers can view or access your content.
              </span>
            </DialogHeader>

            <div className="mt-6 flex justify-center">
              <Button className="h-12 gap-3 px-6 text-sm sm:text-base text-white">
                <Play className="size-4 fill-current" />
                Start session
              </Button>
            </div>

            <div className="my-8 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span className="px-1">Or</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <section className="flex flex-col items-center gap-3">
              <h2 className="text-xl font-semibold text-primary sm:text-2xl">
                Shareable link
              </h2>
              <span className="text-sm text-muted-foreground sm:text-base">
                Export as a read-only link.
              </span>
              <Button
                className="mt-3 h-12 gap-3 px-6 text-sm sm:text-base text-white"
                onClick={() => setShareableLink((prev) => !prev)}
              >
                <Link2 className="size-4" />
                Export to link
              </Button>
            </section>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
