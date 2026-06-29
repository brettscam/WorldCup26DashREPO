# WC 2026 Mega Dashboard

A single-page World Cup 2026 analytics dashboard built with **Next.js (App Router)**, **React 19**, and **Recharts**. Originally prototyped in [v0](https://v0.app), reconstructed here as clean, typed source.

## What's inside

Nine interactive tabs, each driven by real tournament data and clickable detail modals:

| Tab | Highlights |
| --- | --- |
| **Scorers** | Top scorers (goals + assists), goal pace by matchday vs past WCs, goals/game by tournament, when-goals-are-scored, go-ahead vs equalizer timeline |
| **Club Power** | Goals-per-player efficiency by club |
| **Dual Nationals** | Eligibility choices and birth-country export |
| **Squad ROI** | Value-for-money ranking + value vs ROI bubble chart |
| **Fan Markets** | Host-city demand index and top travelling fan nations |
| **Confederations** | Representation growth 2010–2026, group-stage W/D/L, advancement rates |
| **Groups** | Group difficulty ranking by squad value |
| **Route Index** | Knockout route difficulty (travel/opponents/bracket/fatigue) + distance travelled |
| **Venues** | Goals-per-game by host venue |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build && npm start
```

## Notes

Data reflects a snapshot updated **Jun 28** (187 goals across 62 matches). Sources: FIFA.com, ESPN, Transfermarkt, FBref, IMF, Tourism Economics, SI, Covers, Sky Sports.
