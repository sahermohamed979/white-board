import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | Sketchly",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "hsl(0 0% 7%)",
          color: "hsl(0 0% 95%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100dvh",
          gap: "1.5rem",
          padding: "2rem",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        {/* Icon box */}
        <div
          style={{
            width: "5rem",
            height: "5rem",
            borderRadius: "1rem",
            background: "hsl(0 0% 13%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="hsl(0 0% 50%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <line x1="11" y1="8" x2="11" y2="11" />
            <line x1="11" y1="14" x2="11.01" y2="14" />
          </svg>
        </div>

        {/* Text */}
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "2.5rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Page not found
          </h1>
          <p
            style={{
              marginTop: "0.625rem",
              fontSize: "0.9375rem",
              color: "hsl(0 0% 55%)",
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: "0.5rem",
            padding: "0.625rem 1.5rem",
            borderRadius: "0.5rem",
            background: "hsl(0 0% 95%)",
            color: "hsl(0 0% 7%)",
            fontWeight: 500,
            fontSize: "0.875rem",
            textDecoration: "none",
          }}
        >
          Go to Sketchly
        </Link>
      </body>
    </html>
  );
}
