# Peak Kinetic Performance Dashboard

A modern athlete performance dashboard built with React, Next.js, Tailwind CSS, and Chart.js. Designed with an NFL Combine report aesthetic blended with Apple Fitness and Hudl influences.

## Brand

- **Black** — `#000000`
- **White** — `#FFFFFF`
- **PKP Red** — `#B31942`

## Features

- Left navigation with icons (desktop) and bottom tab bar (tablet/mobile)
- 7 dashboard pages with placeholder athlete data
- Reusable UI components (cards, progress bars, stat cards, badges)
- Interactive Chart.js graphs (line, bar, radar, doughnut)
- Animated progress bars
- Responsive layout for desktop and tablet

## Pages

| Page | Route |
|------|-------|
| Athlete Profile | `/dashboard/athlete-profile` |
| Movement Screen | `/dashboard/movement-screen` |
| Screening Mobility | `/dashboard/screening-mobility` |
| Performance Testing | `/dashboard/performance-testing` |
| Progress Tracking | `/dashboard/progress-tracking` |
| Force Plate | `/dashboard/force-plate` |
| Coach Report | `/dashboard/coach-report` |

## Getting Started

```bash
cd ~/Projects/peak-kinetic-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **Chart.js** + **react-chartjs-2**
- **Lucide React** (icons)
- **TypeScript**

## Project Structure

```
src/
├── app/                  # Next.js pages & layouts
├── components/
│   ├── charts/           # Chart.js wrappers
│   ├── layout/           # Sidebar, mobile nav, shell
│   └── ui/               # Reusable UI components
├── data/                 # Placeholder athlete data
├── lib/                  # Utilities
└── types/                # TypeScript interfaces
```

## Placeholder Data

All athlete data is stored in `src/data/` as static TypeScript modules. No database connection is configured yet.
