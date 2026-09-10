import React from "react";
import { Clock, Link2Off } from "lucide-react";
import { Link } from "@/src/i18n/navigation";

export default function ErrorShare({
  isExpired,
  message,
}: {
  isExpired: boolean;
  message: string;
}) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      {/* Icon */}
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted">
        {isExpired ? (
          <Clock className="h-12 w-12 text-muted-foreground" />
        ) : (
          <Link2Off className="h-12 w-12 text-muted-foreground" />
        )}
      </div>

      {/* Text */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {isExpired ? "Link expired" : "Link unavailable"}
        </h1>
        <p className="mt-2 text-muted-foreground">{message}</p>
      </div>

      {/* CTA */}
      <Link
        href="/"
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Go to Sketchly
      </Link>
    </div>
  );
}
