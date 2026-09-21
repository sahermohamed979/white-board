"use client";

import { Button } from "@/src/shared/components/ui/button";
import { useRealtimeChannel } from "@/src/features/v3/realtime/hooks/use-realtime-channel";

export function RealtimeTest({ boardId }: { boardId: string }) {
  // Realtime channel
  const { status, sendTestMessage } = useRealtimeChannel(
    boardId,
    "00000000-0000-4000-8000-000000000001",
  );
  console.log("status", status);

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Realtime status:</span>
        <span
          data-status={status}
          className={
            status === "SUBSCRIBED"
              ? "text-sm font-medium text-primary"
              : status === "CHANNEL_ERROR" || status === "TIMED_OUT"
                ? "text-sm font-medium text-destructive"
                : "text-sm font-medium text-muted-foreground"
          }
        >
          {status}
        </span>
      </div>

      <Button
        variant="default"
        size="lg"
        disabled={status !== "SUBSCRIBED"}
        onClick={sendTestMessage}
      >
        Send Test Message
      </Button>

      {status !== "SUBSCRIBED" && (
        <p className="text-xs text-muted-foreground">
          Button is disabled until the channel is subscribed.
          {status === "CHANNEL_ERROR" &&
            " A channel error occurred — check the browser console for details."}
          {status === "TIMED_OUT" &&
            " Subscription timed out — check your Supabase Realtime configuration."}
          {status === "CLOSED" &&
            " Channel closed — it will be re-created on mount."}
        </p>
      )}
    </div>
  );
}
