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
import { useCreateShareLink } from "../hooks/share-hook";
import { useBoardStore } from "../../v1/store/board-store";
import { CreateShareLinkApiResponse } from "../../v1/types/share.types";

export default function SessionButton() {
  const elements = useBoardStore((state) => state.elements);
  const backgroundColor = useBoardStore((state) => state.backgroundColor);
  const backgroundGrid = useBoardStore((state) => state.backgroundGrid);
  const boardId = useBoardStore((state) => state.currentBoardId);
  const [shareableLink, setShareableLink] = useState(false);
  const [started, setStarted] = useState(false);
  const { mutate, isPending, data, isError } = useCreateShareLink();
  const handleCreateShareLink = () => {
    if (!boardId) return;

    mutate(
      {
        boardId,
        data: {
          elements,
          backgroundColor,
          backgroundGrid,
        },
      },
      {
        onSuccess: (result) => {
          if (result.status) {
            setShareableLink(true);
          }
        },
        onError: (error) => {
          console.error("Failed to create share link:", error.message);
        },
      },
    );
  };
  return (
    <div className="fixed top-4 right-4 z-1">
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

        {shareableLink && (
          <ShareLinkButton
            ShareData={data || ({} as CreateShareLinkApiResponse)}
          />
        )}
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
                disabled={isPending || !boardId}
                onClick={() => {
                  handleCreateShareLink();
                }}
              >
                <Link2 className="size-4" />
                {isPending ? "Generating link..." : "Export to link"}
              </Button>
              {isError && (
                <p className="text-red-500">Failed to create share link</p>
              )}
            </section>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
