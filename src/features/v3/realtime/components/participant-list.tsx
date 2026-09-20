"use client";

import React from "react";
import { Users, X } from "lucide-react";
import type { ParticipantPresence } from "../types/realtime-collaboration.types";
import { Button } from "@/src/shared/components/ui/button";

export interface ParticipantListProps {
  participants: ParticipantPresence[];
  currentParticipant: ParticipantPresence;
  open: boolean;
  onClose: () => void;
}

export function ParticipantList({
  participants,
  currentParticipant,
  open,
  onClose,
}: ParticipantListProps) {
  if (!open) return null;

  const totalCount = participants.length + 1;

  return (
    <div className="fixed top-16 left-4 z-50 w-64 rounded-2xl border border-border bg-card/95 backdrop-blur p-4 shadow-xl animate-in fade-in-0 zoom-in-95">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Participants ({totalCount}/10)
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="size-7 p-0 rounded-full"
          onClick={onClose}
        >
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
        {/* Current User */}
        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span
              className="size-3 rounded-full shadow-xs"
              style={{ backgroundColor: currentParticipant.color }}
            />
            <span className="font-medium text-foreground">
              {currentParticipant.name || "You"}
            </span>
          </div>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            You
          </span>
        </div>

        {/* Remote Participants */}
        {participants.map((p) => (
          <div
            key={p.participantId}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="size-3 rounded-full shadow-xs"
                style={{ backgroundColor: p.color }}
              />
              <span className="font-medium text-foreground">
                {p.name || "Collaborator"}
              </span>
            </div>
            {p.isOwner && (
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">
                Owner
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParticipantList;
