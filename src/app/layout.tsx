import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sketchly-gamma.vercel.app"),
  title: {
    default: "Sketchly — Interactive Virtual Whiteboard & Sketching App",
    template: "%s | Sketchly",
  },
  description:
    "Create beautiful, interactive digital whiteboards with Sketchly. Brainstorm, sketch, draw with hand-drawn aesthetics, and export high-resolution designs with ease.",
  icons: {
    icon: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
