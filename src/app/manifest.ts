import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sketchly — Interactive Virtual Whiteboard & Sketching App",
    short_name: "Sketchly",
    description:
      "Create diagrams, sketch wireframes, and unleash your creativity with hand-drawn rough aesthetics, real-time persistence, custom grids, and high-res vector export.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/logo.webp",
        sizes: "any",
        type: "image/webp",
      },
    ],
  };
}
