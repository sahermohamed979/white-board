"use client";

import React, { useState } from "react";
import { Copy, Check, Users, Power, Radio } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import { cn } from "@/src/shared/lib/utils";
import type { ParticipantPresence } from "../types/realtime-collaboration.types";
import { ParticipantList } from "./participant-list";
import { EndSessionDialog } from "./end-session-dialog";

export interface SessionHeaderProps {
  channelStatus: string;
  participantCount: number;
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
  participants,
  currentParticipant,
  timeLeftFormatted,
  isOwner,
  joinToken,
  locale = "en",
  onEndSession,
  isEndingSession,
}: SessionHeaderProps) {
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
      <header className="fixed top-4 left-4 z-40 flex items-center gap-2 sm:gap-3 rounded-2xl border border-border/70 bg-card/90 backdrop-blur-md px-3.5 py-2 shadow-sm text-xs font-medium">
        {/* Brand & Connection Status */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-2.5 rounded-full transition-colors",
              isConnected
                ? "bg-emerald-500 animate-pulse"
                : channelStatus === "CHANNEL_ERROR" || channelStatus === "TIMED_OUT"
                  ? "bg-destructive"
                  : "bg-amber-500 animate-pulse",
            )}
          />
          <span className="font-semibold text-foreground hidden sm:inline">
            Sketchly
          </span>
          <span className="text-muted-foreground hidden sm:inline">Live</span>
        </div>

        <span className="text-border">|</span>

        {/* Live Participant Count Button (opens list) */}
        <button
          type="button"
          onClick={() => setShowParticipants((prev) => !prev)}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          title="View participants"
        >
          <Users className="size-3.5 text-primary" />
          <span className="font-semibold">
            {participantCount} / 10
          </span>
        </button>

        {/* Remaining Session Countdown Timer */}
        {timeLeftFormatted && (
          <>
            <span className="text-border">|</span>
            <span className="font-mono text-muted-foreground" title="Time remaining in session">
              ⏱ {timeLeftFormatted}
            </span>
          </>
        )}

        <span className="text-border">|</span>

        {/* Quick Copy Link Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="h-7 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          title="Copy session link"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span className="hidden md:inline">Share</span>
            </>
          )}
        </Button>

        {/* Owner-Only End Session Button */}
        {isOwner && (
          <>
            <span className="text-border">|</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowEndDialog(true)}
              className="h-7 px-2.5 text-xs font-medium text-white rounded-lg shadow-xs"
            >
              <Power className="size-3.5 mr-1" />
              End Session
            </Button>
          </>
        )}
      </header>

      {/* Participant List Popover */}
      <ParticipantList
        open={showParticipants}
        participants={participants}
        currentParticipant={currentParticipant}
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
