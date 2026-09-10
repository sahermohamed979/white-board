import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      {/* Icon */}
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>

      {/* Text */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Board not found</h1>
        <p className="mt-2 text-muted-foreground">
          This share link doesn&apos;t exist or has already expired.
        </p>
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
