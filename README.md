# 🎨 Sketchly — Next-Gen Virtual Whiteboard & Sketching App

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand%205-4338CA?style=for-the-badge&logo=redux&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

**A high-performance, local-first interactive whiteboard built with modern web technologies.**  
*Hand-drawn sketchy aesthetics, infinite canvas navigation, real-time persistence, and native bilingual (EN/AR) support.*

[Features](#-key-features) • [Architecture](#-architecture--design-decisions) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Shortcuts](#-keyboard-shortcuts) • [Roadmap](#-roadmap)

</div>

---

## 🌟 Overview

**Sketchly** is an open-source, client-side virtual whiteboard engineered for wireframing, architecture diagrams, mind-mapping, and creative freehand sketching. Inspired by the hand-drawn aesthetic of tools like Excalidraw, Sketchly combines vector precision with organic, rough styling while delivering snappy 60+ FPS interactions through an optimized SVG rendering pipeline.

---

## ✨ Key Features

### 🖌️ Natural Drawing & Vector Geometry
- **Hand-Drawn Aesthetics**: Powered by [Rough.js](https://roughjs.com/), rendering rectangles, diamonds, circles, lines, and arrows with customizable roughness, bowing, and fill styles (`solid`, `hachure`, `cross-hatch`).
- **Pressure-Sensitive Freehand**: Integrated with [perfect-freehand](https://github.com/steveruizok/perfect-freehand) for responsive, natural ink strokes.
- **Rich Typography & Text Tool**: In-place SVG-aligned text editing with configurable font families (`sans`, `handwritten`, `mono`), font sizes, and alignments.

### 📐 Canvas Navigation & Manipulation
- **Infinite Canvas**: Smooth infinite panning and zoom controls (10% to 500%) with cursor-centered focal zoom.
- **Interactive Multi-Selection**: Bounding-box selection, drag-to-move, multi-element deletion, and transform calculations.
- **Floating Contextual Style Panel**: Instant customization of stroke color, fill color, stroke width, stroke style (`solid`, `dashed`, `dotted`), roughness, and font styling for active/selected items.

### 💾 Local-First Persistence & Time-Travel
- **Zero-Latency Offline Storage**: Built with [Dexie.js](https://dexie.org/) (IndexedDB wrapper). Boards load instantly, persist across sessions, and work fully offline without mandatory cloud dependencies.
- **Comprehensive Undo / Redo**: Powered by `zustand` + `zundo` temporal state middleware, supporting up to 50 history checkpoints with selective partialization.

### 🌓 Theming & Custom Grids
- **Seamless Light / Dark Modes**: Integrated via `next-themes` with tailored Oklch and HSL color tokens.
- **Dynamic Backgrounds & Grids**: Switch between multiple surface tones and dynamic grid overlays (`none`, `small-grid`, `large-grid`, `dots`, `lines`) powered by CSS variables that adapt automatically to theme changes.

### 🌍 First-Class Internationalization (i18n)
- Native bilingual support for **English (LTR)** and **Arabic (RTL)** with fluid layout flipping via `next-intl` v4.

### 📤 Multi-Format Export
- Export diagrams with zero quality loss into **PNG** or **SVG** with customizable background inclusion toggles using `html-to-image`.

---

## 🏗️ Architecture & Design Decisions

### 1. Rendering Engine: SVG vs. HTML Canvas
```
┌────────────────────────────────────────────────────────┐
│                      Board Screen                      │
├────────────────────────────────────────────────────────┤
│  Tools & Navigation (HTML Overlay / Base UI / Lucide)  │
├────────────────────────────────────────────────────────┤
│  Selection Overlay (Transform Bounding Boxes)          │
├────────────────────────────────────────────────────────┤
│  SVG Canvas Layer (Hardware Accelerated via Matrix3D)  │
│  ├── Rough.js Path Elements                            │
│  ├── Freehand Polygons (perfect-freehand)              │
│  └── ForeignObject / SVG Text Elements                │
└────────────────────────────────────────────────────────┘
```
- **Why SVG?** SVG elements retain crisp vector fidelity at any zoom level, maintain an inspectable DOM hierarchy, simplify hit-testing for bounding boxes, and export directly to clean vector files.
- **Transform Performance**: Canvas panning and scaling are applied to an SVG grouping element via hardware-accelerated CSS transforms (`matrix3d` / `translate3d`), bypassing per-frame DOM re-renders.

### 2. State Management & Storage Pipeline
- **Zustand + Immer**: High-frequency mouse/pointer actions mutate state immutably without boilerplates.
- **Selective History (Zundo)**: History snapshots only track element mutations (`partialize: (state) => ({ elements: state.elements })`), preventing UI state (pan/zoom/active tool) from polluting the undo stack.
- **Asynchronous Persistence Layer**: Dexie/IndexedDB operations run asynchronously off the main render path, ensuring zero stutter during continuous freehand drawing.

### 3. CSS Variables & Theme Architecture
- Tailwind CSS v4 `@theme inline` coupled with CSS Custom Properties (`var(--border)`, `var(--bg-0)`, etc.) allows instant dark-mode switching without forcing canvas redraws.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server/Client components, dynamic metadata |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict mode, end-to-end type safety |
| **UI Library** | [React 19](https://react.dev/) | Concurrent features, modern hooks |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation utility-first styling with `@tailwindcss/postcss` |
| **Component Primitives** | [shadcn/ui](https://ui.shadcn.com/) / [@base-ui/react](https://base-ui.com/) | Accessible, unstyled headless UI foundations |
| **State Management** | [Zustand 5](https://github.com/pmndrs/zustand) | Lightweight, centralized client-state store |
| **Time Travel** | [Zundo](https://github.com/charkour/zundo) | Undo/redo temporal middleware for Zustand |
| **Offline DB** | [Dexie.js 4](https://dexie.org/) | Reactive, structured client-side IndexedDB persistence |
| **Sketch Engine** | [Rough.js](https://roughjs.com/) | 2D canvas/SVG hand-drawn graphics engine |
| **Inking Algorithm** | [perfect-freehand](https://github.com/steveruizok/perfect-freehand) | Pressure-sensitive smoothing for handwriting & drawing |
| **i18n** | [next-intl 4](https://next-intl-docs.vercel.app/) | Locale routing, translations, and RTL layout support |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent vector icon set |

---

## 📁 Project Structure

```
board-app/
├── src/
│   ├── app/                               # Next.js App Router
│   │   ├── [locale]/                      # Localized route segments (en / ar)
│   │   │   ├── layout.tsx                 # Root locale layout with SEO metadata & fonts
│   │   │   └── page.tsx                   # Main Board entry point
│   │   ├── globals.css                    # Design tokens, CSS vars, Tailwind imports
│   │   └── layout.tsx                     # Base HTML shell
│   │
│   ├── features/                          # Feature-driven modular architecture
│   │   └── main/                          # Core Whiteboard domain
│   │       ├── components/                # Whiteboard UI (Toolbar, Canvas, Panels, Grids)
│   │       ├── constants/                 # Domain constants (grid styles, tools, shortcuts)
│   │       ├── db/                        # Dexie.js IndexedDB schema and operations
│   │       ├── hooks/                     # Custom hooks (pointer events, shortcuts, transform)
│   │       ├── lib/                       # Math, bounding box, hit-testing, and export utilities
│   │       ├── schema/                    # Zod validation schemas
│   │       ├── screens/                   # High-level screens (board-screen.tsx)
│   │       ├── store/                     # Zustand store definition with Zundo middleware
│   │       ├── types/                     # TypeScript types (element, tools, store interfaces)
│   │       └── utils/                     # Feature-specific helpers
│   │
│   ├── i18n/                              # Internationalization configuration & routing
│   │   ├── messages/                      # Translation dictionaries (en.json, ar.json)
│   │   ├── navigation.ts                  # Localized Link, useRouter, usePathname
│   │   └── routing.ts                     # Supported locales and default locale definition
│   │
│   └── shared/                            # Cross-cutting primitives and shared infrastructure
│       ├── components/                    # Reusable shadcn/ui components (button, dropdown, etc.)
│       ├── context/                       # App providers (Theme, i18n, Toast)
│       └── lib/                           # Global utilities (`cn` helper)
│
├── public/                                # Static assets (favicon, images)
├── next.config.ts                         # Next.js configuration
├── tailwind.config.ts                     # Tailwind CSS configuration
├── tsconfig.json                          # TypeScript configuration
└── package.json                           # Dependencies and scripts
```

---

## ⌨️ Keyboard Shortcuts

| Key / Combination | Action | Description |
|---|---|---|
| <kbd>V</kbd> | **Select Tool** | Activate pointer selection mode |
| <kbd>P</kbd> | **Pen Tool** | Freehand sketching mode |
| <kbd>R</kbd> | **Rectangle** | Draw hand-drawn rectangles |
| <kbd>O</kbd> | **Circle / Ellipse** | Draw hand-drawn circles |
| <kbd>A</kbd> | **Arrow** | Draw directional arrows |
| <kbd>T</kbd> | **Text** | Place editable text on canvas |
| <kbd>E</kbd> | **Eraser** | Delete clicked elements |
| <kbd>H</kbd> / Space + Drag | **Hand Tool** | Pan across the infinite canvas |
| <kbd>Ctrl</kbd> + <kbd>A</kbd> | **Select All** | Select all elements on the canvas |
| <kbd>Delete</kbd> / <kbd>Backspace</kbd> | **Delete** | Remove selected elements |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | **Undo** | Revert the last board action |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | **Redo** | Replay the previously undone action |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `18.18.0` or later (Node 20+ recommended)
- **Package Manager**: `npm`, `pnpm`, `yarn`, or `bun`

### 1. Clone the Repository
```bash
git clone https://github.com/sahermohamed979/white-board.git
cd white-board/board-app
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root of the project:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience the whiteboard.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## ⚡ Performance Optimizations

1. **Layer Separation**: The SVG drawing surface and HTML overlay UI controls run in independent stacking contexts to minimize composite recalculations.
2. **Debounced Disk Sync**: In-memory Zustand state updates instantaneously, while IndexedDB write operations are coordinated efficiently to avoid I/O bottlenecks.
3. **CSS-Driven Grid Rendering**: Grid patterns leverage repetitive background gradients managed directly by CSS variables, preventing expensive SVG path recalculations during viewport transforms.

---

## 🗺️ Roadmap

- [ ] **Real-time Collaboration**: Multi-user live rooms with WebRTC / WebSocket cursors.
- [ ] **Custom Templates**: Flowcharts, wireframe blueprints, and architecture templates.
- [ ] **Image Upload & Annotation**: Drag-and-drop external images onto the canvas with cropping and drawing overlays.
- [ ] **Cloud Sync & Workspaces**: Optional cloud backup and team sharing powered by Supabase.
- [ ] **Laser Pointer Mode**: Ephemeral presenter strokes for live demos and presentations.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

---

<div align="center">
Made with ❤️ by <a href="https://github.com/sahermohamed979">Saher Mohamed</a>
</div>
