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
import { useTranslations, useLocale } from "next-intl";
import { useCreateRealtimeSession } from "@/src/features/v3/realtime/hooks/use-create-realtime-session";
import { SessionShareDialog } from "@/src/features/v3/realtime/components/session-share-dialog";

export default function SessionButton() {
  const t = useTranslations("main.session");
  const locale = useLocale();
  const elements = useBoardStore((state) => state.elements);
  const backgroundColor = useBoardStore((state) => state.backgroundColor);
  const backgroundGrid = useBoardStore((state) => state.backgroundGrid);
  const boardId = useBoardStore((state) => state.currentBoardId);
  const [shareableLink, setShareableLink] = useState(false);
  const [started, setStarted] = useState(false);
  const [sessionUrl, setSessionUrl] = useState<string | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | undefined>(
    undefined,
  );

  // Session mutation
  const {
    mutate: createSession,
    isPending: isSessionPending,
    isError: isSessionError,
  } = useCreateRealtimeSession();
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

  const handleStartSession = () => {
    if (!boardId) return;

    createSession(
      { boardId },
      {
        onSuccess: (result) => {
          if (result.status) {
            sessionStorage.setItem(
              "sketchly_owned_session",
              result.payload.sessionId,
            );
            const url = `${window.location.origin}/${locale}/session/${result.payload.joinToken}`;
            setSessionUrl(url);
            setSessionExpiresAt(result.payload.expiresAt);
            setStarted(true);
            console.log("[Sketchly] Session created:", result.payload);
          }
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
              <Radio /> {t("live")}
            </Button>
          }
        />

        {shareableLink && (
          <ShareLinkButton
            ShareData={data || ({} as CreateShareLinkApiResponse)}
          />
        )}
        {started && sessionUrl && (
          <SessionShareDialog
            open={started}
            url={sessionUrl}
            expiresAt={sessionExpiresAt}
            onClose={() => setStarted(false)}
          />
        )}
        {!started && !shareableLink && (
          <DialogContent className="md:max-w-xl w-screen h-fit gap-0 rounded-2xl p-6 text-center ">
            <DialogHeader className="items-center gap-3">
              <DialogTitle className="text-xl font-semibold text-primary sm:text-2xl">
                {t("liveCollaboration")}
              </DialogTitle>
              <DialogDescription className="max-w-md text-sm leading-6 text-foreground/80 sm:text-base">
                {t("invitePeopleToCollaborate")}
              </DialogDescription>
              <span className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                {t("protectedSession")}
              </span>
            </DialogHeader>

            <div className="mt-6 flex flex-col items-center gap-2">
              <Button
                className="h-12 gap-3 px-6 text-sm sm:text-base text-white"
                disabled={isSessionPending || !boardId}
                onClick={handleStartSession}
              >
                <Play className="size-4 fill-current" />
                {isSessionPending ? t("startingSession") : t("startSession")}
              </Button>
              {isSessionError && (
                <p className="text-sm text-destructive">
                  {t("failedToStartSession")}
                </p>
              )}
            </div>

            <div className="my-8 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span className="px-1">{t("or")}</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <section className="flex flex-col items-center gap-3">
              <h2 className="text-xl font-semibold text-primary sm:text-2xl">
                {t("shareableLink")}
              </h2>
              <span className="text-sm text-muted-foreground sm:text-base">
                {t("exportAsReadOnlyLink")}
              </span>
              <Button
                className="mt-3 h-12 gap-3 px-6 text-sm sm:text-base text-white"
                disabled={isPending || !boardId}
                onClick={() => {
                  handleCreateShareLink();
                }}
              >
                <Link2 className="size-4" />
                {isPending ? t("generatingLink") : t("exportToLink")}
              </Button>
              {isError && (
                <p className="text-red-500">{t("failedToCreateShareLink")}</p>
              )}
            </section>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
