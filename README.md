# 🎨 Sketchly — Next-Gen Virtual Whiteboard & Sketching App

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand%205-4338CA?style=for-the-badge&logo=redux&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase%20Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

**A high-performance, local-first interactive whiteboard built with modern web technologies.**  
*Hand-drawn sketchy aesthetics, multi-user real-time collaboration, infinite canvas navigation, instant offline persistence, and native bilingual (EN/AR) support.*

[✨ Live Demo](https://sketchly-gamma.vercel.app) • [Features](#-key-features) • [Real-time Collaboration](#-real-time-collaboration) • [Architecture](#-architecture--design-decisions) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Shortcuts](#-keyboard-shortcuts) • [Performance](#-performance--mobile-audit)

</div>

---

## 🌟 Overview

**Sketchly** is an open-source, client-side virtual whiteboard engineered for wireframing, architecture diagrams, mind-mapping, and creative freehand sketching. Inspired by the organic aesthetic of tools like Excalidraw, Sketchly combines vector precision with rough, hand-drawn styling while delivering ultra-smooth 60+ FPS interactions through an optimized SVG rendering pipeline and Supabase Realtime multi-user synchronization.

---

## ✨ Key Features

### 🖌️ Natural Drawing & Vector Geometry
- **Hand-Drawn Aesthetics**: Powered by [Rough.js](https://roughjs.com/), rendering rectangles, diamonds, circles, straight lines, and arrows with customizable roughness, bowing, and fill styles (`solid`, `hachure`, `cross-hatch`).
- **Pressure-Sensitive Freehand**: Integrated with [perfect-freehand](https://github.com/steveruizok/perfect-freehand) for responsive, natural ink strokes.
- **Rich Typography & Text Tool**: In-place SVG-aligned text editing with configurable font families (`sans`, `handwritten`, `mono`), font sizes, and alignments.
- **Image Upload & Placement**: Insert JPG, PNG, and WebP images onto the canvas with Zod-validated file handling, automatic viewport centering, aspect ratio preservation, and interactive bounding-box transformation handles.

### 👥 Real-Time Multi-User Collaboration (v3)
- **Live Collaborative Rooms**: Instant peer-to-peer room creation with unique join tokens and customizable participant identities.
- **Remote Cursor Awareness**: Real-time cursor presence tracking with participant name tags and deterministic color coding, throttled to sub-35ms intervals for minimal network overhead.
- **Real-Time Stroke Streaming**: Watch collaborators sketch, draw shapes, and edit the canvas live.
- **Room Lifecycle Management**: Active participant counters, connection status pill, live 30-minute countdown timer, and owner-governed room termination.

### 🔗 Read-Only Shareable Links (v2)
- **Time-Limited Sharing**: Export snapshots into encrypted, read-only shareable links (`/share/[token]`) with expiration dates.
- **Instant Local Import**: Viewers can review shared boards with full pan and zoom navigation, and save the snapshot into their private local storage with a single click.

### 📐 Infinite Canvas Navigation & Manipulation
- **Hardware-Accelerated Canvas**: Smooth infinite panning and cursor-centered focal zoom (10% to 500%) running directly off the React render loop.
- **Interactive Multi-Selection**: Bounding-box selection, drag-to-move, multi-element deletion, and 8-point resize handles.
- **Floating Contextual Style Panel**: Instant customization of stroke color, fill color, stroke width, stroke style (`solid`, `dashed`, `dotted`), roughness, and font styling for active/selected items.

### 💾 Local-First Persistence & Time-Travel
- **Zero-Latency Offline Storage**: Built with [Dexie.js](https://dexie.org/) (IndexedDB wrapper). Boards load instantly, persist across sessions, and work fully offline without mandatory cloud accounts.
- **Optimized Undo / Redo**: Powered by `zustand` + `zundo` temporal state middleware with boolean-scoped selectors that eliminate unnecessary UI re-renders during active sketching.

### 🌓 Theming & Custom Grids
- **Seamless Light / Dark Modes**: Integrated via `next-themes` with tailored Oklch and HSL color tokens.
- **Dynamic Backgrounds & Grids**: Switch between multiple surface tones and dynamic grid overlays (`none`, `small-grid`, `large-grid`, `dots`, `lines`) that adapt automatically to theme changes without canvas redraws.

### 🌍 First-Class Internationalization (i18n)
- Native bilingual support for **English (LTR)** and **Arabic (RTL)** with fluid layout flipping and localized screen reader accessibility via `next-intl` v4.

### 📤 Multi-Format Vector Export
- Export diagrams with zero quality loss into **PNG** or **SVG** with customizable background inclusion toggles using `html-to-image`.

---

## 🏗️ Architecture & Design Decisions

### 1. Multi-Tier Feature Architecture
```
src/
├── app/                               # Next.js 16 App Router
│   ├── [locale]/                      # Localized routes (en / ar)
│   │   ├── session/[token]/           # Live collaboration room (v3)
│   │   ├── share/[token]/             # Read-only snapshot viewer (v2)
│   │   └── page.tsx                   # Main whiteboard (v1)
│   └── api/                           # Secure Route Handlers (session, share, token exchange)
│
├── features/                          # Domain-Driven Architecture
│   ├── v1/                            # Core Whiteboard Engine
│   │   ├── components/                # CanvasSvgLayer, ElementRenderer, StylePanel, Tools
│   │   ├── db/                        # Dexie.js schema & asynchronous IndexedDB operations
│   │   ├── hooks/                     # useCanvasTransform, usePointerEvents, useKeyboardShortcuts
│   │   ├── lib/                       # Rough.js shape generators, hit-testing, freehand math
│   │   └── store/                     # Zustand store with Zundo temporal time-travel
│   │
│   ├── v2/                            # Share System
│   │   ├── components/                # SaveButton, ErrorShare, ShareLinkDialog
│   │   ├── hooks/                     # Share links creation & validation hooks
│   │   └── screens/                   # High-performance read-only ShareScreen
│   │
│   └── v3/realtime/                   # Real-time Collaboration Engine
│       ├── api/                       # Owner capability verification & token security
│       ├── components/                # RemoteCursorLayer, SessionHeader, ParticipantList
│       ├── hooks/                     # useRealtimeChannel, useRealtimePresence, useRealtimeBoard
│       └── screens/                   # Interactive collaborative SessionScreen
│
└── shared/                            # Global design tokens, headless UI components, utilities
```

### 2. High-Performance Canvas Rendering Pipeline
```
┌────────────────────────────────────────────────────────┐
│                      Board Screen                      │
├────────────────────────────────────────────────────────┤
│  HUD Overlays (Tools, Floating Style Panel, Theme)     │
├────────────────────────────────────────────────────────┤
│  Selection Overlay (8-Point Resize Handles & Bounds)   │
├────────────────────────────────────────────────────────┤
│  Remote Cursors Layer (Isolated Presence Avatars)      │
├────────────────────────────────────────────────────────┤
│  Canvas SVG Layer                                      │
│  └── <g transform="translate(x, y) scale(s)">          │
│      ├── Rough.js Vector Shapes (Memoized)             │
│      ├── Freehand Polygons (perfect-freehand)          │
│      ├── ForeignObject / In-place SVG Text             │
│      └── Embedded Images with Aspect Ratio Locks       │
└────────────────────────────────────────────────────────┘
```
- **Direct DOM Panning & Zooming**: Canvas transform coordinates are mutated directly onto the SVG grouping element (`<g>`) using hardware-accelerated transforms and `requestAnimationFrame`. UI scale readouts use `useSyncExternalStore` to keep viewport interaction 100% decoupled from the React render path.
- **Component Memoization**: Shape elements are individually wrapped in `React.memo` with deterministic geometric evaluation, preventing untouched shapes from recalculating when moving or drawing new items.
- **Throttled Interactions**: Pointer move events and remote cursor broadcasts are throttled using `requestAnimationFrame` (~28–30 updates/sec) to ensure lag-free rendering even with multiple active participants.

---

## ⚡ Performance & Mobile Audit

Sketchly has been profiled and audited using Chrome DevTools and Google Lighthouse under mobile emulation (4G throttling, 4x CPU slowdown):

| Category | Mobile Score | Status |
| :--- | :---: | :---: |
| 🟢 **Accessibility** | **100 / 100** | Full keyboard navigation, descriptive ARIA labels, RTL voiceover support |
| 🟢 **Best Practices** | **96 / 100** | Strict CSP standards, modern Web APIs, HTTPS-ready |
| 🟢 **SEO** | **92 / 100** | Dynamic localized OpenGraph metadata, JSON-LD schemas, sitemap & robots |
| 🟢 **Performance** | **84 / 100** | **0.8s First Contentful Paint**, **0.000 Cumulative Layout Shift (CLS)** |

### Key Optimizations:
1. **Zero-Delay Share View**: Read-only boards bypass local IndexedDB initialization, reducing Time to Interactive by over 300ms.
2. **Lean State Subscriptions**: Undo and redo button states subscribe only to boolean existence checks (`length > 0`) rather than entire history arrays, avoiding re-renders on every mouse move.
3. **Event Isolation**: Canvas interactions invoke `stopPropagation` to prevent window-level gesture capture conflicts.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server/Client components, Route Handlers, Turbopack |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict mode, end-to-end type safety |
| **UI Library** | [React 19](https://react.dev/) | Concurrent features, modern hooks |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS with `@tailwindcss/postcss` and dynamic CSS tokens |
| **Component Primitives** | [shadcn/ui](https://ui.shadcn.com/) / [@base-ui/react](https://base-ui.com/) | Accessible, headless UI primitives |
| **State Management** | [Zustand 5](https://github.com/pmndrs/zustand) | Lightweight, centralized client-state store with Immer middleware |
| **Time Travel** | [Zundo](https://github.com/charkour/zundo) | Undo/redo temporal state middleware |
| **Realtime Engine** | [Supabase Realtime](https://supabase.com/docs/guides/realtime) | WebSocket broadcast and presence for live collaborative rooms |
| **Offline Storage** | [Dexie.js 4](https://dexie.org/) | Reactive, structured IndexedDB client storage |
| **Vector Sketch Engine** | [Rough.js](https://roughjs.com/) | 2D canvas/SVG hand-drawn graphics engine |
| **Inking Algorithm** | [perfect-freehand](https://github.com/steveruizok/perfect-freehand) | Pressure-sensitive smoothing for handwriting & drawing |
| **i18n** | [next-intl 4](https://next-intl-docs.vercel.app/) | Localized routing, translation bundles, and RTL layout support |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent vector icon set |

---

## ⌨️ Keyboard Shortcuts

| Key / Combination | Tool / Action | Description |
|---|---|---|
| <kbd>V</kbd> | **Select Tool** | Activate pointer selection & transform mode |
| <kbd>P</kbd> | **Pen Tool** | Freehand sketching & inking mode |
| <kbd>R</kbd> | **Rectangle** | Draw hand-drawn rectangles |
| <kbd>O</kbd> | **Circle / Ellipse** | Draw hand-drawn circles and ellipses |
| <kbd>A</kbd> | **Arrow** | Draw directional arrows |
| <kbd>T</kbd> | **Text** | Click anywhere on canvas to type text |
| <kbd>E</kbd> | **Eraser** | Delete clicked or dragged-over elements |
| <kbd>H</kbd> / Space + Drag | **Hand Tool** | Pan across the infinite canvas |
| <kbd>Ctrl</kbd> + <kbd>A</kbd> | **Select All** | Select all elements on canvas |
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
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root of the project:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🗺️ Roadmap

- [x] **Core Hand-Drawn Whiteboard**: Vector shapes, freehand inking, and contextual style panel.
- [x] **Local-First Persistence**: Instant IndexedDB synchronization and undo/redo history.
- [x] **Image Upload & Placement**: Insert JPG/PNG/WebP assets with scaling and aspect ratio locking.
- [x] **Read-Only Shareable Links**: Encrypted, time-limited share links with one-click local import.
- [x] **Real-time Live Collaboration**: Multi-user rooms with remote cursors, drawing streaming, and room management.
- [x] **Bilingual Internationalization (i18n)**: Full English (LTR) and Arabic (RTL) experience.
- [ ] **Custom Templates**: Pre-made flowcharts, system design blocks, and wireframe kits.
- [ ] **Laser Pointer Mode**: Ephemeral presenter strokes for live demos and meetings.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

---

<div align="center">
Made with ❤️ by <a href="https://github.com/sahermohamed979">Saher Mohamed</a>
</div>
