"use client";

import React, { useState } from "react";
import { Copy, Check, Users, Power } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/shared/components/ui/button";
import { cn } from "@/src/shared/lib/utils";
import type { ParticipantPresence } from "../types/realtime-collaboration.types";
import { ParticipantList } from "./participant-list";
import { EndSessionDialog } from "./end-session-dialog";

export interface SessionHeaderProps {
  channelStatus: string;
  participantCount: number;
  maxParticipants: number;
  participants: ParticipantPresence[];
  currentParticipant: ParticipantPresence;
  timeLeftFormatted: string | null;
  isOwner: boolean;
  joinToken: string;
  locale?: string;
  onEndSession: () => void;
  isEndingSession: boolean;
}

export function SessionHeader({
  channelStatus,
  participantCount,
  maxParticipants,
  participants,
  currentParticipant,
  timeLeftFormatted,
  isOwner,
  joinToken,
  locale = "en",
  onEndSession,
  isEndingSession,
}: SessionHeaderProps) {
  const t = useTranslations("main.session");

  const [showParticipants, setShowParticipants] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (typeof window === "undefined" || !joinToken) return;
    const url = `${window.location.origin}/${locale}/session/${joinToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const isConnected = channelStatus === "SUBSCRIBED";
  return (
    <>
      <header
        className={cn(
          "fixed z-40 ",
          // Mobile
          "bottom-3 right-2 ",
          // Desktop
          "sm:bottom-4 sm:left-auto sm:right-4 ",

          "flex items-center",
          "rounded-2xl border border-border/70",
          "bg-card/90 backdrop-blur-md",
          "shadow-lg",

          // Responsive spacing
          "px-2.5 py-2 sm:px-3 sm:py-2",

          "text-xs font-medium",
          "",
        )}
      >
        {/* Brand & Connection */}
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className={cn(
              "size-2.5 shrink-0 rounded-full transition-colors",
              isConnected
                ? "bg-emerald-500 animate-pulse"
                : channelStatus === "CHANNEL_ERROR" ||
                    channelStatus === "TIMED_OUT"
                  ? "bg-destructive"
                  : "bg-amber-500 animate-pulse",
            )}
          />

          <span className="hidden font-semibold text-foreground sm:inline">
            Sketchly
          </span>

          <span className="hidden text-muted-foreground md:inline">
            {t("live")}
          </span>
        </div>

        <span className="mx-1.5 hidden text-border sm:inline">|</span>

        {/* Participants */}
        <button
          type="button"
          onClick={() => setShowParticipants((prev) => !prev)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg",
            "px-1.5 py-1 sm:px-2",
            "text-foreground",
            "transition-colors hover:bg-muted/60",
            "cursor-pointer",
          )}
          title={t("viewParticipants")}
        >
          <Users className="size-3.5 shrink-0 text-primary" />

          <span className="font-semibold tabular-nums">
            {participantCount}
            <span className="text-muted-foreground">/{maxParticipants}</span>
          </span>

          <span className="hidden text-muted-foreground sm:inline">
            {t("participants")}
          </span>
        </button>

        {/* Timer */}
        {timeLeftFormatted && (
          <>
            <span className="mx-1 hidden text-border sm:inline">|</span>

            <div
              className="flex items-center gap-1 text-muted-foreground"
              title={t("timeRemaining")}
            >
              <span>⏱</span>

              <span className="font-mono text-[11px] tabular-nums">
                {timeLeftFormatted}
              </span>
            </div>
          </>
        )}

        {/* Copy Link */}
        <span className="mx-1.5 text-border">|</span>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className={cn(
            "h-7 rounded-lg",
            "px-1.5 sm:px-2",
            "gap-1",
            "text-xs",
            "text-muted-foreground hover:text-foreground",
          )}
          title={t("copySessionLink")}
        >
          {copied ? (
            <>
              <Check className="size-3.5 shrink-0 text-emerald-500" />

              <span className="hidden sm:inline text-emerald-500">
                {t("linkCopied")}
              </span>
            </>
          ) : (
            <>
              <Copy className="size-3.5 shrink-0" />

              <span className="hidden sm:inline">{t("share")}</span>
            </>
          )}
        </Button>

        {/* End Session */}
        {isOwner && (
          <>
            <span className="mx-1.5 text-border">|</span>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowEndDialog(true)}
              className={cn(
                "h-7 rounded-lg",
                "px-2 sm:px-2.5",
                "text-xs font-medium text-white",
                "shadow-xs",
              )}
              title={t("endSession")}
            >
              <Power className="size-3.5 shrink-0 sm:mr-1" />

              <span className="hidden sm:inline">{t("endSession")}</span>
            </Button>
          </>
        )}
      </header>

      {/* Participant List Popover */}
      <ParticipantList
        open={showParticipants}
        participants={participants}
        currentParticipant={currentParticipant}
        maxParticipants={maxParticipants}
        onClose={() => setShowParticipants(false)}
      />

      {/* End Session Confirmation Dialog */}
      <EndSessionDialog
        open={showEndDialog}
        isPending={isEndingSession}
        onConfirm={() => {
          onEndSession();
          setShowEndDialog(false);
        }}
        onClose={() => setShowEndDialog(false)}
      />
    </>
  );
}

export default SessionHeader;
