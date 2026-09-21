"use client";

import { useState } from "react";

import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";
import { Input } from "@/src/shared/components/ui/input";

interface JoinSessionDialogProps {
  open: boolean;
  onJoin: (name: string) => void;
}

export function JoinSessionDialog({ open, onJoin }: JoinSessionDialogProps) {
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
    <Dialog open={open}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>Join Sketchly Session</DialogTitle>
          <DialogDescription>Choose the name shown beside your cursor.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            value={name}
            maxLength={80}
            placeholder="Your name"
            onChange={(event) => setName(event.target.value)}
          />
          <Button className="w-full text-white" disabled={!isNameValid} type="submit">
            Join Session
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
