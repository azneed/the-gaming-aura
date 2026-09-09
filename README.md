# The Gaming Aura

Interactive landing page for a premium gaming lounge featuring PS5 console gaming and billiards experiences. Built with vanilla JavaScript, Vite, and Canvas-based physics simulation.

## Overview

A single-page application showcasing a dual-experience gaming venue. Features smooth scroll animations, an interactive billiards physics simulation, and a booking form interface. Designed for desktop and mobile browsing.

## Technology Stack

- Vite (build tool)
- GSAP + Lenis (scroll animations and smooth scrolling)
- Canvas (HTML5 physics simulation)
- Vanilla JavaScript
- CSS3 (custom properties, animations, backdrop filters)

## Features

- **Smooth Scroll Experience** — GSAP ScrollTrigger + Lenis integration for responsive scroll animations
- **Interactive Billiards Simulation** — Full physics engine with ball collision, friction, and drag-to-strike mechanics on Canvas
- **Split-Screen Section** — Hover-based flex expansion between console and billiards zones with dynamic theme switching
- **Horizontal Scroll Gallery** — GSAP-driven pinned horizontal scroll for game showcase cards
- **Custom Cursor** — Inertia-based cursor with hover interactions
- **Responsive Design** — Mobile-optimized with touch support for billiards canvas
- **Booking Form** — Multi-state form with loading and success states
- **Mobile Navigation** — Drawer-based menu for smaller screens

## Local Development

### Prerequisites

- Node.js (v14+)

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Outputs optimized files to `/dist`

### Preview Production Build

```bash
npm run preview
```

## Deployment

Configured for GitHub Pages:

```bash
npm run deploy
```

## Technical Highlights

- **Physics Engine** — Elastic collision detection, momentum conservation, and realistic ball physics
- **GSAP Integration** — ScrollTrigger for scroll-linked animations and pinned horizontal scroll sections
- **Lenis Smooth Scroll** — Gesture-aware smooth scrolling with custom easing
- **Canvas Optimization** — Responsive canvas resizing and touch event handling for mobile

## Project Structure

```
src/
  main.js        Core JavaScript with all animation and physics logic
  style.css      Design system with CSS variables and Aura theme colors
index.html       Single-page entry point
package.json     Dependencies and build scripts
```
