import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sketchly",
  description:
    "Create beautiful, interactive digital whiteboards with Sketchly. Brainstorm, collaborate, and bring your ideas to life with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
