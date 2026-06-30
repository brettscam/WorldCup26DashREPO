"use client"

import { useState, type CSSProperties, type ReactNode } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid,
} from "recharts"

/* ------------------------------------------------------------------ */
/* Design tokens                                                      */
/* ------------------------------------------------------------------ */
const COLOR = {
  bg: "#060d1a",
  card: "#0d1829",
  panel: "#121f36",
  green: "#00e5a0",
  blue: "#3b82f6",
  amber: "#f59e0b",
  red: "#ef4444",
  purple: "#a855f7",
  cyan: "#06b6d4",
  text: "#e2e8f0",
  muted: "#8b9bb5",
  border: "#1a2d4a",
  gold: "#fbbf24",
}
const FONT = "'Figtree', system-ui, sans-serif"

const tooltipStyle = {
  contentStyle: {
    background: COLOR.panel,
    border: `1px solid ${COLOR.border}`,
    borderRadius: 8,
    color: COLOR.text,
    fontSize: 11,
    fontFamily: FONT,
  },
  itemStyle: { color: COLOR.text },
  labelStyle: { color: COLOR.muted },
}

const roiColor = (v: number) => (v >= 9 ? COLOR.gold : v >= 7 ? COLOR.green : v >= 4 ? COLOR.blue : COLOR.red)

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */
const TABS = [
  "Scorers",
  "Club Power",
  "Dual Nationals",
  "Squad ROI",
  "Fan Markets",
  "Confederations",
  "Groups",
  "Route Index",
  "Venues",
  "Possession",
]

const SOURCES = [
  "FIFA.com",
  "ESPN",
  "Transfermarkt",
  "FBref",
  "IMF",
  "Tourism Economics",
  "SI",
  "Covers",
  "Sky Sports",
]

const scorers = [
  { n: "Messi", t: "ARG", c: "Inter Miami", g: 5, a: 0, wc: 18 },
  { n: "Haaland", t: "NOR", c: "Man City", g: 4, a: 0, wc: 4 },
  { n: "Mbappe", t: "FRA", c: "Real Madrid", g: 4, a: 2, wc: 16 },
  { n: "Vinicius Jr", t: "BRA", c: "Real Madrid", g: 4, a: 1, wc: 4 },
  { n: "Dembele", t: "FRA", c: "PSG", g: 4, a: 1, wc: 4 },
  { n: "J.David", t: "CAN", c: "Juventus", g: 3, a: 1, wc: 3 },
  { n: "Undav", t: "GER", c: "Stuttgart", g: 3, a: 2, wc: 3 },
  { n: "Saibari", t: "MAR", c: "PSV", g: 3, a: 0, wc: 3 },
  { n: "Manzambi", t: "SUI", c: "Freiburg", g: 3, a: 0, wc: 3 },
  { n: "M.Cunha", t: "BRA", c: "Man Utd", g: 3, a: 1, wc: 3 },
  { n: "Brobbey", t: "NED", c: "Sunderland", g: 3, a: 0, wc: 3 },
  { n: "Balogun", t: "USA", c: "Monaco", g: 2, a: 1, wc: 2 },
  { n: "Kane", t: "ENG", c: "Bayern", g: 2, a: 1, wc: 10 },
  { n: "Havertz", t: "GER", c: "Arsenal", g: 2, a: 0, wc: 2 },
  { n: "Oyarzabal", t: "ESP", c: "R.Sociedad", g: 2, a: 1, wc: 2 },
  { n: "Gakpo", t: "NED", c: "Liverpool", g: 2, a: 0, wc: 2 },
  { n: "Ueda", t: "JPN", c: "Feyenoord", g: 2, a: 1, wc: 2 },
  { n: "Kamada", t: "JPN", c: "C.Palace", g: 2, a: 0, wc: 2 },
  { n: "Ronaldo", t: "POR", c: "Al-Nassr", g: 2, a: 0, wc: 10 },
  { n: "Sarr", t: "SEN", c: "C.Palace", g: 2, a: 0, wc: 2 },
  { n: "Isak", t: "SWE", c: "Liverpool", g: 1, a: 3, wc: 1 },
  { n: "E.Just", t: "NZL", c: "Motherwell", g: 2, a: 0, wc: 2 },
  { n: "Elanga", t: "SWE", c: "Newcastle", g: 2, a: 0, wc: 2 },
]

const clubPower = [
  { c: "Real Madrid", g: 10, p: 4, r: 2.5, t: "Vinicius(4) Mbappe(4)" },
  { c: "Inter Miami", g: 5, p: 2, r: 2.5, t: "Messi(5)" },
  { c: "Motherwell", g: 2, p: 1, r: 2, t: "E.Just(2) NZL" },
  { c: "C.Palace", g: 6, p: 4, r: 1.5, t: "Kamada Sarr Munoz(2ea)" },
  { c: "PSV", g: 3, p: 3, r: 1, t: "Saibari(3) MAR" },
  { c: "Sunderland", g: 3, p: 3, r: 1, t: "Brobbey(3) NED" },
  { c: "PSG", g: 5, p: 6, r: 0.83, t: "Dembele(4)" },
  { c: "Stuttgart", g: 3, p: 4, r: 0.75, t: "Undav(3+2A)" },
  { c: "Freiburg", g: 3, p: 4, r: 0.75, t: "Manzambi(3)" },
  { c: "Liverpool", g: 5, p: 8, r: 0.63, t: "Gakpo(2) Isak(1+3A)" },
  { c: "Juventus", g: 3, p: 5, r: 0.6, t: "J.David(3)" },
  { c: "Man Utd", g: 4, p: 8, r: 0.5, t: "M.Cunha(3)" },
  { c: "Bayern", g: 4, p: 10, r: 0.4, t: "Kane(2) Olise(3A)" },
  { c: "Man City", g: 6, p: 19, r: 0.32, t: "Haaland(4)" },
  { c: "Arsenal", g: 4, p: 16, r: 0.25, t: "Havertz(2)" },
]

const squadROI = [
  { t: "France", v: 1520, f: 2, gp: "I", pts: 9, gd: 8, roi: 9.5 },
  { t: "England", v: 1360, f: 4, gp: "L", pts: 4, gd: 2, roi: 4.5 },
  { t: "Spain", v: 1220, f: 8, gp: "H", pts: 7, gd: 5, roi: 7.5 },
  { t: "Portugal", v: 1010, f: 6, gp: "K", pts: 6, gd: 5, roi: 7 },
  { t: "Germany", v: 947, f: 15, gp: "E", pts: 6, gd: 7, roi: 7.5 },
  { t: "Brazil", v: 928, f: 5, gp: "C", pts: 7, gd: 4, roi: 7.5 },
  { t: "Argentina", v: 808, f: 1, gp: "J", pts: 9, gd: 5, roi: 9 },
  { t: "Netherlands", v: 754, f: 3, gp: "F", pts: 7, gd: 6, roi: 8.5 },
  { t: "Norway", v: 590, f: 26, gp: "I", pts: 3, gd: 1, roi: 5 },
  { t: "Belgium", v: 548, f: 7, gp: "G", pts: 2, gd: 0, roi: 3 },
  { t: "Ivory Coast", v: 522, f: 40, gp: "E", pts: 6, gd: 2, roi: 7.5 },
  { t: "Morocco", v: 448, f: 13, gp: "C", pts: 7, gd: 2, roi: 8 },
  { t: "USA", v: 386, f: 14, gp: "D", pts: 6, gd: 3, roi: 8.5 },
  { t: "Uruguay", v: 359, f: 9, gp: "H", pts: 1, gd: -1, roi: 1 },
  { t: "Japan", v: 320, f: 18, gp: "F", pts: 5, gd: 5, roi: 9 },
  { t: "Colombia", v: 310, f: 11, gp: "K", pts: 6, gd: 2, roi: 8 },
  { t: "Canada", v: 228, f: 33, gp: "B", pts: 6, gd: 3, roi: 8 },
  { t: "Switzerland", v: 175, f: 19, gp: "B", pts: 6, gd: 5, roi: 9 },
  { t: "Australia", v: 180, f: 23, gp: "D", pts: 5, gd: 1, roi: 7.5 },
  { t: "Egypt", v: 120, f: 35, gp: "G", pts: 4, gd: 2, roi: 8 },
  { t: "Cape Verde", v: 15, f: 68, gp: "H", pts: 3, gd: 0, roi: 10 },
  { t: "Qatar", v: 20, f: 40, gp: "B", pts: 1, gd: -3, roi: 2 },
  { t: "Iraq", v: 25, f: 60, gp: "I", pts: 0, gd: -8, roi: 0.5 },
  { t: "Jordan", v: 20, f: 70, gp: "J", pts: 0, gd: -3, roi: 1 },
  { t: "Ecuador", v: 369, f: 30, gp: "E", pts: 4, gd: -1, roi: 6.5 },
  { t: "Sweden", v: 406, f: 20, gp: "F", pts: 4, gd: 3, roi: 7 },
  { t: "Croatia", v: 387, f: 10, gp: "L", pts: 3, gd: 0, roi: 5.5 },
  { t: "Ghana", v: 110, f: 45, gp: "L", pts: 4, gd: 0, roi: 7 },
  { t: "Bosnia", v: 85, f: 55, gp: "B", pts: 4, gd: 0, roi: 7.5 },
  { t: "Paraguay", v: 95, f: 42, gp: "D", pts: 4, gd: -2, roi: 6.5 },
]

const dualNationals = [
  { p: "Mbappe", ch: "FRA", alt: "CMR/ALG", g: 4 },
  { p: "M.Cunha", ch: "BRA", alt: "Single", g: 3 },
  { p: "Balogun", ch: "USA", alt: "ENG/NGA", g: 2 },
  { p: "Ayari", ch: "SWE", alt: "TUN", g: 2 },
  { p: "Yamal", ch: "ESP", alt: "MAR", g: 1 },
  { p: "Bouaddi", ch: "MAR", alt: "FRA", g: 0 },
  { p: "Hakimi", ch: "MAR", alt: "ESP", g: 0 },
  { p: "D.Doue", ch: "FRA", alt: "CIV", g: 0 },
  { p: "G.Doue", ch: "CIV", alt: "FRA", g: 0 },
  { p: "I.Williams", ch: "GHA", alt: "ESP", g: 0 },
  { p: "N.Williams", ch: "ESP", alt: "GHA", g: 0 },
  { p: "Flores", ch: "MEX", alt: "CAN/ENG", g: 0 },
]

const birthExport = [
  { c: "France", playing: 23, exported: 77 },
  { c: "Spain", playing: 23, exported: 5 },
  { c: "England", playing: 23, exported: 3 },
  { c: "Germany", playing: 23, exported: 2 },
  { c: "Cameroon", playing: 0, exported: 12 },
  { c: "Nigeria", playing: 0, exported: 10 },
]

const fanMarkets = [
  { city: "NY/NJ", impact: "$800M+", hotel: "200-300%", fans: "UK, ARG, JPN", demand: 9.5 },
  { city: "Dallas", impact: "$620M", hotel: "1,400%", fans: "AUS, UK, MEX", demand: 9 },
  { city: "Atlanta", impact: "$1B", hotel: "300%+", fans: "UK, GER, JPN", demand: 9 },
  { city: "Miami", impact: "$500M+", hotel: "150%+", fans: "ARG, COL, BRA", demand: 8.5 },
  { city: "Los Angeles", impact: "$550M", hotel: "180%", fans: "MEX, JPN, AUS", demand: 8.5 },
  { city: "Mexico City", impact: "MXN peak", hotel: "150%", fans: "ARG, domestic", demand: 8 },
  { city: "Vancouver", impact: "$280M", hotel: "160%", fans: "JPN, KOR, AUS", demand: 7.5 },
  { city: "Houston", impact: "$450M", hotel: "200%+", fans: "MEX, COL", demand: 7.5 },
  { city: "Boston", impact: "$350M", hotel: "180%", fans: "UK, IRE", demand: 7.5 },
  { city: "San Francisco", impact: "$400M", hotel: "170%", fans: "JPN, KOR", demand: 7.5 },
  { city: "Toronto", impact: "$300M", hotel: "140%", fans: "UK, EUR", demand: 7 },
  { city: "Seattle", impact: "$300M", hotel: "150%", fans: "JPN, CAN", demand: 7 },
]

const fanNations = [
  { n: "United States", d: 10, type: "Domestic" },
  { n: "United Kingdom", d: 9.5, type: "Int'l" },
  { n: "Mexico", d: 9, type: "Cross-border" },
  { n: "Japan", d: 8.5, type: "Int'l" },
  { n: "Argentina", d: 8.5, type: "Int'l" },
  { n: "Australia", d: 8, type: "Int'l" },
  { n: "Brazil", d: 8, type: "Int'l" },
  { n: "Spain", d: 7.5, type: "Int'l" },
  { n: "Colombia", d: 7.5, type: "Int'l" },
  { n: "Germany", d: 7.5, type: "Int'l" },
]

const confeds = [
  { conf: "UEFA", teams: 16, w: 12, d: 10, l: 10, adv: 12, color: "#3b82f6" },
  { conf: "CAF", teams: 10, w: 5, d: 8, l: 7, adv: 6, color: "#f59e0b" },
  { conf: "AFC", teams: 9, w: 5, d: 7, l: 7, adv: 5, color: "#ef4444" },
  { conf: "CONMEBOL", teams: 6, w: 7, d: 5, l: 4, adv: 5, color: "#10b981" },
  { conf: "CONCACAF", teams: 6, w: 5, d: 3, l: 7, adv: 4, color: "#a855f7" },
  { conf: "OFC", teams: 1, w: 1, d: 0, l: 2, adv: 0, color: "#06b6d4" },
]

const confedGrowth = [
  { yr: "2010", UEFA: 13, CAF: 6, AFC: 4, CONMEBOL: 5, CONCACAF: 3, OFC: 1 },
  { yr: "2014", UEFA: 13, CAF: 5, AFC: 4, CONMEBOL: 6, CONCACAF: 4, OFC: 0 },
  { yr: "2018", UEFA: 14, CAF: 5, AFC: 5, CONMEBOL: 5, CONCACAF: 3, OFC: 0 },
  { yr: "2022", UEFA: 13, CAF: 5, AFC: 6, CONMEBOL: 4, CONCACAF: 4, OFC: 0 },
  { yr: "2026", UEFA: 16, CAF: 10, AFC: 9, CONMEBOL: 6, CONCACAF: 6, OFC: 1 },
]

const groups = [
  { g: "I", teams: "FRA/NOR/SEN/IRQ", val: 2620, diff: 9.5 },
  { g: "L", teams: "ENG/CRO/GHA/PAN", val: 1960, diff: 8.5 },
  { g: "H", teams: "ESP/URU/CPV/KSA", val: 1640, diff: 8.5 },
  { g: "K", teams: "POR/COL/COD/UZB", val: 1680, diff: 8 },
  { g: "F", teams: "NED/JPN/SWE/TUN", val: 1350, diff: 8 },
  { g: "J", teams: "ARG/ALG/AUT/JOR", val: 1300, diff: 7.5 },
  { g: "C", teams: "BRA/MAR/SCO/HAI", val: 1550, diff: 7.5 },
  { g: "E", teams: "GER/ECU/CIV/CUW", val: 1530, diff: 7 },
  { g: "D", teams: "USA/TUR/AUS/PAR", val: 1100, diff: 6.5 },
  { g: "B", teams: "CAN/SUI/BIH/QAT", val: 680, diff: 5.5 },
  { g: "G", teams: "BEL/EGY/IRN/NZL", val: 780, diff: 5 },
  { g: "A", teams: "MEX/KOR/RSA/CZE", val: 573, diff: 4.5 },
]

const routeIndex = [
  { t: "France", tr: 1, op: 2, br: 2, fa: 1, tot: 6, st: "Grp I W", r32: "vs 3rd" },
  { t: "Argentina", tr: 1, op: 3, br: 2, fa: 1, tot: 7, st: "Grp J W", r32: "vs H 2nd" },
  { t: "USA", tr: 2, op: 2, br: 3, fa: 2, tot: 9, st: "Grp D W", r32: "vs Bosnia" },
  { t: "Germany", tr: 3, op: 3, br: 3, fa: 2, tot: 11, st: "Grp E W", r32: "vs 3rd" },
  { t: "Egypt", tr: 3, op: 3, br: 3, fa: 2, tot: 11, st: "Grp G 1st", r32: "vs 3rd" },
  { t: "Switzerland", tr: 3, op: 3, br: 3, fa: 2, tot: 11, st: "Grp B 2nd", r32: "vs TBD" },
  { t: "Sweden", tr: 3, op: 3, br: 3, fa: 2, tot: 11, st: "Grp F 3rd", r32: "vs grp W" },
  { t: "Ivory Coast", tr: 3, op: 3, br: 3, fa: 2, tot: 11, st: "Grp E 2nd", r32: "vs Norway" },
  { t: "Canada", tr: 4, op: 3, br: 3, fa: 2, tot: 12, st: "Grp B W", r32: "vs TBD" },
  { t: "Netherlands", tr: 3, op: 4, br: 3, fa: 2, tot: 12, st: "Grp F W", r32: "vs Morocco" },
  { t: "Morocco", tr: 3, op: 4, br: 3, fa: 2, tot: 12, st: "Grp C 2nd", r32: "vs NED" },
  { t: "Colombia", tr: 3, op: 4, br: 4, fa: 3, tot: 14, st: "Grp K 1st", r32: "vs TBD" },
  { t: "Portugal", tr: 3, op: 4, br: 4, fa: 3, tot: 14, st: "Grp K 2nd", r32: "vs TBD" },
  { t: "Ecuador", tr: 3, op: 4, br: 4, fa: 3, tot: 14, st: "Grp E 3rd", r32: "vs grp W" },
  { t: "Bosnia", tr: 5, op: 3, br: 3, fa: 3, tot: 14, st: "Grp B 3rd", r32: "vs USA" },
  { t: "Brazil", tr: 3, op: 5, br: 4, fa: 3, tot: 15, st: "Grp C W", r32: "vs Japan" },
  { t: "England", tr: 5, op: 3, br: 3, fa: 4, tot: 15, st: "Grp L 1st", r32: "vs 3rd" },
  { t: "Japan", tr: 3, op: 5, br: 4, fa: 3, tot: 15, st: "Grp F 2nd", r32: "vs Brazil" },
  { t: "Cape Verde", tr: 4, op: 5, br: 4, fa: 3, tot: 16, st: "Grp H 3rd", r32: "vs grp W" },
  { t: "Spain", tr: 6, op: 4, br: 4, fa: 5, tot: 19, st: "Grp H W", r32: "vs J 2nd" },
]

const travelKm = [
  { t: "Curacao", km: 10000 },
  { t: "England", km: 8990 },
  { t: "Czechia", km: 7284 },
  { t: "Bosnia", km: 7200 },
  { t: "S.Africa", km: 6333 },
  { t: "Canada", km: 5360 },
  { t: "Brazil", km: 3740 },
  { t: "USA", km: 3400 },
  { t: "S.Korea", km: 1029 },
  { t: "Mexico", km: 840 },
  { t: "Argentina", km: 742 },
  { t: "France", km: 538 },
]

const paceByMatchday = [
  { md: "MD1", 2026: 3.13, 2022: 2.63, 2018: 2.56, 2014: 2.88, 2010: 2.19 },
  { md: "MD2", 2026: 2.95, 2022: 2.5, 2018: 2.63, 2014: 2.63, 2010: 2.31 },
  { md: "MD3", 2026: 3, 2022: 2.94, 2018: 2.75, 2014: 2.5, 2010: 2.31 },
  { md: "R32 (proj)", 2026: 2.8 },
  { md: "R16 (proj)", 2026: 2.6 },
]

const gpgByTournament = [
  { yr: "1986", gpg: 2.54 },
  { yr: "1990", gpg: 2.21 },
  { yr: "1994", gpg: 2.71 },
  { yr: "1998", gpg: 2.67 },
  { yr: "2002", gpg: 2.52 },
  { yr: "2006", gpg: 2.3 },
  { yr: "2010", gpg: 2.27 },
  { yr: "2014", gpg: 2.67 },
  { yr: "2018", gpg: 2.64 },
  { yr: "2022", gpg: 2.69 },
  { yr: "2026", gpg: 3.02 },
]

const goalIntervals = [
  { interval: "1-15", pct: 12 },
  { interval: "16-30", pct: 15 },
  { interval: "31-45+", pct: 19 },
  { interval: "46-60", pct: 13 },
  { interval: "61-75", pct: 13 },
  { interval: "76-90+", pct: 28 },
]

// All 187 goals plotted by minute (X) and matchday (Y).
const goalTimeline = [
  { min: 2, p: "", t: "IRQ", type: "other", md: 1 }, { min: 3, p: "Messi", t: "ARG", type: "goahead", md: 1 }, { min: 4, p: "", t: "PAN", type: "goahead", md: 1 }, { min: 6, p: "Nmecha", t: "GER", type: "goahead", md: 1 }, { min: 8, p: "Quinones", t: "MEX", type: "goahead", md: 1 }, { min: 9, p: "Angulo", t: "ECU", type: "equalizer", md: 1 },
  { min: 10, p: "", t: "SEN", type: "other", md: 1 }, { min: 11, p: "Manzambi", t: "SUI", type: "goahead", md: 1 }, { min: 12, p: "Balogun", t: "USA", type: "goahead", md: 1 }, { min: 13, p: "", t: "AUS", type: "other", md: 1 }, { min: 17, p: "", t: "SWE", type: "other", md: 1 }, { min: 25, p: "Balogun", t: "USA", type: "other", md: 1 },
  { min: 28, p: "Cunha", t: "BRA", type: "goahead", md: 1 }, { min: 30, p: "Haaland", t: "NOR", type: "equalizer", md: 1 }, { min: 31, p: "", t: "HAI", type: "other", md: 1 }, { min: 33, p: "", t: "FRA", type: "other", md: 1 }, { min: 34, p: "Messi", t: "ARG", type: "other", md: 1 }, { min: 35, p: "Sarr", t: "SEN", type: "goahead", md: 1 },
  { min: 36, p: "", t: "BEL", type: "goahead", md: 1 }, { min: 38, p: "", t: "KSA", type: "goahead", md: 1 }, { min: 39, p: "", t: "ENG", type: "goahead", md: 1 }, { min: 41, p: "", t: "CPV", type: "other", md: 1 }, { min: 42, p: "", t: "COL", type: "other", md: 1 }, { min: 43, p: "", t: "ARG", type: "goahead", md: 1 },
  { min: 44, p: "", t: "KSA", type: "other", md: 1 }, { min: 45, p: "Wissa", t: "COD", type: "equalizer", md: 1 }, { min: 46, p: "", t: "CRO", type: "goahead", md: 1 }, { min: 47, p: "Havertz", t: "GER", type: "other", md: 1 }, { min: 49, p: "", t: "ESP", type: "other", md: 1 }, { min: 50, p: "", t: "HAI", type: "equalizer", md: 1 },
  { min: 51, p: "", t: "BEL", type: "goahead", md: 1 }, { min: 52, p: "Pepe", t: "CIV", type: "goahead", md: 1 }, { min: 53, p: "", t: "PAR", type: "goahead", md: 1 }, { min: 54, p: "", t: "BEL", type: "other", md: 1 }, { min: 55, p: "Mbappe", t: "FRA", type: "goahead", md: 1 }, { min: 57, p: "", t: "ECU", type: "other", md: 1 },
  { min: 58, p: "", t: "ALG", type: "goahead", md: 1 }, { min: 59, p: "", t: "JPN", type: "goahead", md: 1 }, { min: 60, p: "Fayzullaev", t: "UZB", type: "equalizer", md: 1 }, { min: 62, p: "", t: "BEL", type: "goahead", md: 1 }, { min: 65, p: "Messi", t: "ARG", type: "other", md: 1 }, { min: 68, p: "", t: "EGY", type: "other", md: 1 },
  { min: 70, p: "Undav", t: "GER", type: "goahead", md: 1 }, { min: 74, p: "", t: "ALG", type: "other", md: 1 }, { min: 75, p: "Isak", t: "SWE", type: "equalizer", md: 1 }, { min: 76, p: "", t: "MAR", type: "other", md: 1 }, { min: 77, p: "", t: "MEX", type: "goahead", md: 1 }, { min: 79, p: "", t: "SEN", type: "other", md: 1 },
  { min: 80, p: "", t: "NZL", type: "goahead", md: 1 }, { min: 82, p: "", t: "KOR", type: "other", md: 1 }, { min: 83, p: "", t: "HAI", type: "goahead", md: 1 }, { min: 84, p: "", t: "MEX", type: "other", md: 1 }, { min: 85, p: "Undav", t: "GER", type: "other", md: 1 }, { min: 86, p: "", t: "ENG", type: "goahead", md: 1 },
  { min: 87, p: "", t: "PAN", type: "other", md: 1 }, { min: 88, p: "Kamada", t: "JPN", type: "equalizer", md: 1 }, { min: 89, p: "Cunha", t: "BRA", type: "goahead", md: 1 }, { min: 90, p: "Mbappe", t: "FRA", type: "other", md: 1 }, { min: 91, p: "Mbaye", t: "SEN", type: "other", md: 1 }, { min: 93, p: "", t: "CUW", type: "goahead", md: 1 },
  { min: 94, p: "", t: "CPV", type: "goahead", md: 1 }, { min: 95, p: "", t: "CUW", type: "other", md: 1 }, { min: 96, p: "", t: "MEX", type: "other", md: 1 }, { min: 2, p: "Saibari", t: "MAR", type: "goahead", md: 2 }, { min: 3, p: "", t: "QAT", type: "equalizer", md: 2 }, { min: 4, p: "", t: "BRA", type: "other", md: 2 },
  { min: 6, p: "", t: "AUT", type: "other", md: 2 }, { min: 9, p: "", t: "UZB", type: "other", md: 2 }, { min: 10, p: "", t: "CPV", type: "goahead", md: 2 }, { min: 12, p: "", t: "JPN", type: "other", md: 2 }, { min: 14, p: "Oyarzabal", t: "ESP", type: "goahead", md: 2 }, { min: 16, p: "", t: "FRA", type: "equalizer", md: 2 },
  { min: 17, p: "", t: "TUN", type: "goahead", md: 2 }, { min: 19, p: "Vargas", t: "SUI", type: "goahead", md: 2 }, { min: 20, p: "", t: "TUR", type: "goahead", md: 2 }, { min: 21, p: "", t: "GHA", type: "goahead", md: 2 }, { min: 22, p: "Munoz", t: "COL", type: "goahead", md: 2 }, { min: 23, p: "", t: "CRO", type: "other", md: 2 },
  { min: 25, p: "", t: "IRN", type: "goahead", md: 2 }, { min: 27, p: "", t: "PAN", type: "equalizer", md: 2 }, { min: 28, p: "", t: "IRN", type: "equalizer", md: 2 }, { min: 31, p: "", t: "COL", type: "other", md: 2 }, { min: 32, p: "", t: "FRA", type: "goahead", md: 2 }, { min: 33, p: "", t: "HAI", type: "other", md: 2 },
  { min: 34, p: "", t: "NZL", type: "equalizer", md: 2 }, { min: 35, p: "", t: "SEN", type: "other", md: 2 }, { min: 36, p: "", t: "NZL", type: "other", md: 2 }, { min: 37, p: "Just", t: "NZL", type: "goahead", md: 2 }, { min: 38, p: "Yamal", t: "ESP", type: "goahead", md: 2 }, { min: 40, p: "Vinicius", t: "BRA", type: "goahead", md: 2 },
  { min: 42, p: "", t: "SCO", type: "other", md: 2 }, { min: 43, p: "", t: "KSA", type: "goahead", md: 2 }, { min: 44, p: "", t: "IRN", type: "other", md: 2 }, { min: 47, p: "", t: "FRA", type: "other", md: 2 }, { min: 49, p: "", t: "SUI", type: "goahead", md: 2 }, { min: 50, p: "Olwan", t: "JOR", type: "goahead", md: 2 },
  { min: 51, p: "", t: "IRQ", type: "equalizer", md: 2 }, { min: 55, p: "", t: "FRA", type: "other", md: 2 }, { min: 56, p: "Mahmic", t: "BIH", type: "goahead", md: 2 }, { min: 58, p: "J.David", t: "CAN", type: "goahead", md: 2 }, { min: 62, p: "", t: "SEN", type: "other", md: 2 }, { min: 63, p: "", t: "BEL", type: "equalizer", md: 2 },
  { min: 64, p: "", t: "COD", type: "goahead", md: 2 }, { min: 65, p: "", t: "PAN", type: "equalizer", md: 2 }, { min: 66, p: "Elanga", t: "SWE", type: "equalizer", md: 2 }, { min: 67, p: "", t: "BEL", type: "other", md: 2 }, { min: 69, p: "", t: "BIH", type: "other", md: 2 }, { min: 70, p: "", t: "MEX", type: "goahead", md: 2 },
  { min: 71, p: "Just", t: "NZL", type: "other", md: 2 }, { min: 72, p: "", t: "BEL", type: "goahead", md: 2 }, { min: 73, p: "", t: "GHA", type: "goahead", md: 2 }, { min: 74, p: "Gakpo", t: "NED", type: "goahead", md: 2 }, { min: 76, p: "", t: "CIV", type: "goahead", md: 2 }, { min: 77, p: "", t: "FRA", type: "goahead", md: 2 },
  { min: 78, p: "Ueda", t: "JPN", type: "goahead", md: 2 }, { min: 79, p: "Salah", t: "EGY", type: "goahead", md: 2 }, { min: 80, p: "Ronaldo", t: "POR", type: "other", md: 2 }, { min: 81, p: "", t: "ENG", type: "other", md: 2 }, { min: 82, p: "", t: "FRA", type: "goahead", md: 2 }, { min: 83, p: "", t: "MAR", type: "other", md: 2 },
  { min: 84, p: "Vinicius", t: "BRA", type: "goahead", md: 2 }, { min: 85, p: "", t: "PAR", type: "equalizer", md: 2 }, { min: 86, p: "", t: "COL", type: "other", md: 2 }, { min: 87, p: "Haaland", t: "NOR", type: "goahead", md: 2 }, { min: 88, p: "", t: "ARG", type: "other", md: 2 }, { min: 89, p: "", t: "KOR", type: "goahead", md: 2 },
  { min: 90, p: "", t: "KOR", type: "equalizer", md: 2 }, { min: 91, p: "", t: "ECU", type: "other", md: 2 }, { min: 93, p: "", t: "CZE", type: "other", md: 2 }, { min: 94, p: "", t: "BEL", type: "other", md: 2 }, { min: 95, p: "Arnautovic", t: "AUT", type: "other", md: 2 }, { min: 96, p: "", t: "CIV", type: "other", md: 2 },
  { min: 1, p: "", t: "CUW", type: "other", md: 3 }, { min: 2, p: "", t: "HAI", type: "other", md: 3 }, { min: 4, p: "", t: "SEN", type: "other", md: 3 }, { min: 9, p: "", t: "PAN", type: "other", md: 3 }, { min: 10, p: "", t: "SUI", type: "goahead", md: 3 }, { min: 14, p: "", t: "ARG", type: "goahead", md: 3 },
  { min: 15, p: "Sane", t: "GER", type: "goahead", md: 3 }, { min: 16, p: "", t: "JPN", type: "goahead", md: 3 }, { min: 20, p: "Dembele", t: "FRA", type: "goahead", md: 3 }, { min: 21, p: "", t: "PAN", type: "goahead", md: 3 }, { min: 23, p: "", t: "CAN", type: "equalizer", md: 3 }, { min: 27, p: "Dembele", t: "FRA", type: "other", md: 3 },
  { min: 28, p: "", t: "NZL", type: "equalizer", md: 3 }, { min: 31, p: "", t: "JPN", type: "other", md: 3 }, { min: 32, p: "Dembele", t: "FRA", type: "other", md: 3 }, { min: 33, p: "", t: "PAN", type: "goahead", md: 3 }, { min: 34, p: "", t: "HAI", type: "goahead", md: 3 }, { min: 35, p: "", t: "PAN", type: "other", md: 3 },
  { min: 37, p: "", t: "BEL", type: "goahead", md: 3 }, { min: 42, p: "Baena", t: "ESP", type: "goahead", md: 3 }, { min: 44, p: "Summerville", t: "NED", type: "goahead", md: 3 }, { min: 46, p: "", t: "SCO", type: "equalizer", md: 3 }, { min: 47, p: "", t: "GHA", type: "other", md: 3 }, { min: 48, p: "", t: "PAR", type: "goahead", md: 3 },
  { min: 50, p: "", t: "CZE", type: "goahead", md: 3 }, { min: 52, p: "", t: "GER", type: "other", md: 3 }, { min: 54, p: "", t: "MAR", type: "other", md: 3 }, { min: 56, p: "", t: "ECU", type: "goahead", md: 3 }, { min: 62, p: "Kane", t: "ENG", type: "goahead", md: 3 }, { min: 63, p: "", t: "KSA", type: "other", md: 3 },
  { min: 64, p: "", t: "BIH", type: "equalizer", md: 3 }, { min: 65, p: "", t: "COL", type: "other", md: 3 }, { min: 66, p: "", t: "EGY", type: "equalizer", md: 3 }, { min: 68, p: "Bellingham", t: "ENG", type: "goahead", md: 3 }, { min: 71, p: "", t: "PAR", type: "other", md: 3 }, { min: 72, p: "Brobbey", t: "NED", type: "goahead", md: 3 },
  { min: 73, p: "", t: "IRN", type: "other", md: 3 }, { min: 76, p: "", t: "NZL", type: "other", md: 3 }, { min: 77, p: "Plata", t: "ECU", type: "goahead", md: 3 }, { min: 78, p: "", t: "KSA", type: "other", md: 3 }, { min: 80, p: "", t: "KOR", type: "goahead", md: 3 }, { min: 81, p: "", t: "AUT", type: "other", md: 3 },
  { min: 82, p: "Oyarzabal", t: "ESP", type: "goahead", md: 3 }, { min: 84, p: "", t: "AUS", type: "goahead", md: 3 }, { min: 85, p: "", t: "NED", type: "goahead", md: 3 }, { min: 86, p: "Ronaldo", t: "POR", type: "goahead", md: 3 }, { min: 87, p: "", t: "BIH", type: "other", md: 3 }, { min: 88, p: "", t: "AUS", type: "other", md: 3 },
  { min: 89, p: "", t: "NED", type: "goahead", md: 3 }, { min: 90, p: "", t: "KOR", type: "equalizer", md: 3 }, { min: 91, p: "", t: "BRA", type: "equalizer", md: 3 }, { min: 92, p: "", t: "NZL", type: "other", md: 3 }, { min: 93, p: "Ayhan", t: "TUR", type: "goahead", md: 3 }, { min: 94, p: "", t: "TUR", type: "other", md: 3 },
  { min: 96, p: "Fidalgo", t: "MEX", type: "other", md: 3 },
]

const venues = [
  { city: "LA", gpg: 3.25, goals: 26, matches: 8 },
  { city: "Vancouver", gpg: 3.67, goals: 22, matches: 6 },
  { city: "Philly", gpg: 3.5, goals: 21, matches: 6 },
  { city: "KC", gpg: 3.17, goals: 19, matches: 6 },
  { city: "Dallas", gpg: 2.78, goals: 25, matches: 9 },
  { city: "NY/NJ", gpg: 2.86, goals: 20, matches: 7 },
  { city: "Atlanta", gpg: 2.75, goals: 22, matches: 8 },
  { city: "Miami", gpg: 3, goals: 18, matches: 6 },
  { city: "Boston", gpg: 2.67, goals: 16, matches: 6 },
  { city: "Seattle", gpg: 2.5, goals: 15, matches: 6 },
  { city: "Houston", gpg: 2.33, goals: 14, matches: 6 },
  { city: "SF", gpg: 2.33, goals: 14, matches: 6 },
  { city: "Toronto", gpg: 2.33, goals: 14, matches: 6 },
  { city: "Mex City", gpg: 2.4, goals: 12, matches: 5 },
  { city: "Guadalajara", gpg: 2.5, goals: 10, matches: 4 },
  { city: "Monterrey", gpg: 2.25, goals: 9, matches: 4 },
]

const possession = [
  { t: "Spain", poss: 62, pts: 7, gf: 5, ga: 0, result: "W2 D1", adv: true },
  { t: "Portugal", poss: 58, pts: 6, gf: 5, ga: 1, result: "W2 L1", adv: true },
  { t: "Germany", poss: 57, pts: 6, gf: 10, ga: 4, result: "W2 L1", adv: true },
  { t: "Belgium", poss: 56, pts: 2, gf: 3, ga: 3, result: "D2 L1", adv: false },
  { t: "England", poss: 55, pts: 4, gf: 4, ga: 2, result: "W1 D1 L1", adv: true },
  { t: "Brazil", poss: 54, pts: 7, gf: 6, ga: 2, result: "W2 D1", adv: true },
  { t: "Argentina", poss: 53, pts: 9, gf: 5, ga: 0, result: "W3", adv: true },
  { t: "France", poss: 52, pts: 9, gf: 10, ga: 2, result: "W3", adv: true },
  { t: "Netherlands", poss: 51, pts: 7, gf: 10, ga: 4, result: "W2 D1", adv: true },
  { t: "Croatia", poss: 51, pts: 3, gf: 2, ga: 2, result: "D1 W1 L1", adv: true },
  { t: "Japan", poss: 48, pts: 5, gf: 7, ga: 4, result: "W1 D1 L1", adv: true },
  { t: "USA", poss: 47, pts: 6, gf: 8, ga: 5, result: "W2 L1", adv: true },
  { t: "Morocco", poss: 46, pts: 7, gf: 4, ga: 2, result: "W2 D1", adv: true },
  { t: "Australia", poss: 45, pts: 5, gf: 3, ga: 2, result: "W1 D2", adv: true },
  { t: "Ecuador", poss: 44, pts: 4, gf: 4, ga: 5, result: "W1 D1 L1", adv: true },
  { t: "S.Korea", poss: 44, pts: 3, gf: 3, ga: 3, result: "W1 D1 L1", adv: false },
  { t: "Turkey", poss: 43, pts: 3, gf: 4, ga: 4, result: "W1 L2", adv: false },
  { t: "Cape Verde", poss: 38, pts: 3, gf: 2, ga: 2, result: "D3", adv: true },
  { t: "Senegal", poss: 42, pts: 3, gf: 2, ga: 2, result: "W1 D1 L1", adv: false },
  { t: "Iraq", poss: 35, pts: 0, gf: 1, ga: 12, result: "L3", adv: false },
  { t: "Curacao", poss: 32, pts: 1, gf: 2, ga: 9, result: "D1 L2", adv: false },
]

// Goals scored within 5 min of opponent scoring
const responseGoals = [
  { match: "ECU vs GER", team: "Ecuador", min: "9'", context: "Germany scored 6'. Ecuador responded 9'. 3-min response", gap: 3, type: "equalizer" },
  { match: "NOR vs SEN", team: "Norway", min: "30'", context: "Senegal scored 25'. Haaland responded 30'. 5-min response", gap: 5, type: "equalizer" },
  { match: "KOR vs CZE", team: "S.Korea", min: "58'", context: "Czechia scored 54'. Hwang responded 58'. 4-min response", gap: 4, type: "equalizer" },
  { match: "USA vs TUR", team: "USA", min: "49'", context: "Turkey led 2-1 at HT. Berhalter scored 49'. Immediate 2nd half response", gap: 4, type: "equalizer" },
  { match: "SWE vs JPN", team: "Sweden", min: "62'", context: "Japan led. Elanga equalized 62'. Changed the match momentum", gap: 5, type: "equalizer" },
  { match: "NED vs TUN", team: "Netherlands", min: "62'", context: "NED scored 60', then again 62'. 2-min double strike", gap: 2, type: "insurance" },
  { match: "POR vs COD", team: "DR Congo", min: "45'", context: "Portugal led 1-0. Wissa equalized at the stroke of halftime", gap: 4, type: "equalizer" },
  { match: "COL vs UZB", team: "Uzbekistan", min: "60'", context: "Colombia led. Fayzullaev equalized 60'. Debut WC goal", gap: 5, type: "equalizer" },
  { match: "BRA vs MAR", team: "Morocco", min: "32'", context: "Brazil scored 28'. Morocco responded 32'. 4-min response", gap: 4, type: "equalizer" },
  { match: "FRA vs NOR", team: "France", min: "27'", context: "Dembele scored 20', then 27'. France doubled within 7 min", gap: 7, type: "insurance" },
  { match: "ARG vs AUT", team: "Austria", min: "95'", context: "Down 2-0. Arnautovic scored 95'. Too little, too late", gap: 0, type: "consolation" },
]

/* ------------------------------------------------------------------ */
/* Shared UI pieces                                                   */
/* ------------------------------------------------------------------ */
type Detail = { t: string; b: string; s?: string }

function Card({
  children,
  glow,
  onClick,
  style,
}: {
  children: ReactNode
  glow?: boolean
  onClick?: () => void
  style?: CSSProperties
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: COLOR.card,
        borderRadius: 8,
        padding: "8px 10px",
        border: `1px solid ${glow ? COLOR.green : COLOR.border}`,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Stat({
  l,
  v,
  sub,
  c,
  onClick,
}: {
  l: string
  v: string
  sub?: string
  c?: string
  onClick?: () => void
}) {
  return (
    <Card onClick={onClick}>
      <div style={{ color: COLOR.muted, fontSize: 8, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
      <div style={{ color: c || COLOR.green, fontSize: 18, fontWeight: 800 }}>{v}</div>
      {sub && <div style={{ color: COLOR.text, fontSize: 9, marginTop: 2 }}>{sub}</div>}
    </Card>
  )
}

function Toggle({ show, fn, total, top }: { show: boolean; fn: () => void; total: number; top: number }) {
  return (
    <button
      onClick={fn}
      style={{
        background: "none",
        border: `1px solid ${COLOR.border}`,
        borderRadius: 6,
        color: COLOR.green,
        fontSize: 10,
        padding: "4px 10px",
        cursor: "pointer",
        marginBottom: 8,
        fontFamily: FONT,
      }}
    >
      {show ? `Top ${top}` : `All ${total}`}
    </button>
  )
}

function Methodology({ text, src }: { text: string; src: string }) {
  return (
    <div style={{ background: COLOR.panel, borderRadius: 8, padding: 12, marginTop: 12, borderLeft: `3px solid ${COLOR.blue}` }}>
      <div style={{ color: COLOR.blue, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>Methodology</div>
      <div style={{ color: COLOR.text, fontSize: 10, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{text}</div>
      <div style={{ color: COLOR.muted, fontSize: 9, marginTop: 6 }}>Sources: {src}</div>
    </div>
  )
}

function Modal({ item, onClose }: { item: Detail | null; onClose: () => void }) {
  if (!item) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.85)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLOR.card,
          borderRadius: 14,
          padding: 20,
          maxWidth: 520,
          width: "100%",
          border: `1px solid ${COLOR.green}`,
          maxHeight: "85vh",
          overflow: "auto",
          fontFamily: FONT,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ color: COLOR.green, fontWeight: 800, fontSize: 16 }}>{item.t}</span>
          <span onClick={onClose} style={{ color: COLOR.muted, cursor: "pointer", fontSize: 18 }}>
            ×
          </span>
        </div>
        <div style={{ color: COLOR.text, fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{item.b}</div>
        {item.s && (
          <div style={{ color: COLOR.muted, fontSize: 9, marginTop: 10, borderTop: `1px solid ${COLOR.border}`, paddingTop: 8 }}>
            {item.s}
          </div>
        )}
      </div>
    </div>
  )
}

const titleStyle = (color: string, mt = 0): CSSProperties => ({
  color,
  fontSize: 12,
  fontWeight: 700,
  marginTop: mt,
  marginBottom: 6,
})
const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))",
  gap: 8,
  marginBottom: 12,
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                          */
/* ------------------------------------------------------------------ */
export default function Dashboard() {
  const [tab, setTab] = useState(0)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const toggle = (k: string) => setOpen((s) => ({ ...s, [k]: !s[k] }))

  return (
    <div style={{ background: COLOR.bg, minHeight: "100vh", padding: "16px 12px", fontFamily: FONT }}>
      <Modal item={detail} onClose={() => setDetail(null)} />
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
          <h1 style={{ color: COLOR.text, fontSize: 24, fontWeight: 900, margin: 0 }}>WC 2026</h1>
          <span
            style={{
              color: COLOR.green,
              fontSize: 10,
              fontWeight: 600,
              background: COLOR.card,
              padding: "3px 8px",
              borderRadius: 10,
              border: `1px solid ${COLOR.green}`,
            }}
          >
            MEGA DASHBOARD
          </span>
        </div>
        <div style={{ color: COLOR.muted, fontSize: 10, marginBottom: 10 }}>
          Updated Jun 30. 187 goals in 62 matches (3.02/game). Tap any element for details.
        </div>

        {/* Sources */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          <span style={{ color: COLOR.muted, fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
            Sources
          </span>
          {SOURCES.map((s) => (
            <span
              key={s}
              style={{
                color: COLOR.text,
                fontSize: 9,
                fontWeight: 600,
                background: COLOR.card,
                border: `1px solid ${COLOR.border}`,
                borderRadius: 6,
                padding: "2px 7px",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
          {TABS.map((label, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              style={{
                background: tab === i ? COLOR.green : COLOR.card,
                color: tab === i ? COLOR.bg : COLOR.text,
                border: `1px solid ${tab === i ? COLOR.green : COLOR.border}`,
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ---------------- Tab 0: Scorers ---------------- */}
        {tab === 0 && (
          <div>
            <div style={gridStyle}>
              <Stat
                l="All-time WC record"
                v="18"
                sub="Messi. Passed Klose (16)"
                c={COLOR.gold}
                onClick={() =>
                  setDetail({
                    t: "Messi's Record",
                    b: "18 career WC goals (all-time record).\n\n12 goals after turning 35, more than Kane (10), Ronaldo (8), or Maradona (8) scored in their entire WC careers.\n\nScored or assisted in 89% of his last 9 WC matches.",
                    s: "ESPN, FIFA.com",
                  })
                }
              />
              <Stat l="Goals pace" v="3.02/gm" sub="+12% vs 2022 (2.69)" c={COLOR.blue} />
              <Stat l="Penalty conversion" v="66.7%" sub="6 of 9. PL avg is 76%" c={COLOR.amber} />
              <Stat l="VAR disallowed" v="5+ goals" sub="1 in every 12 matches" c={COLOR.red} />
            </div>

            <Toggle show={!!open.sc} fn={() => toggle("sc")} total={scorers.length} top={12} />
            <div style={{ height: open.sc ? 26 * scorers.length + 40 : 340 }}>
              <ResponsiveContainer>
                <BarChart data={open.sc ? scorers : scorers.slice(0, 12)} layout="vertical" margin={{ left: 80, right: 30 }}>
                  <XAxis type="number" tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <YAxis type="category" dataKey="n" tick={{ fill: COLOR.text, fontSize: 10 }} width={75} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={((v: any, name: any) => [v, name === "g" ? "Goals" : "Assists"]) as any}
                    labelFormatter={((label: any) => {
                      const row = scorers.find((s) => s.n === label)
                      return `${label} (${row?.t}) | ${row?.c}\nCareer WC: ${row?.wc}`
                    }) as any}
                  />
                  <Bar
                    dataKey="g"
                    name="Goals"
                    fill={COLOR.green}
                    radius={[0, 4, 4, 0]}
                    barSize={open.sc ? 10 : 14}
                    label={{ position: "right", fill: COLOR.text, fontSize: 9, formatter: (v: any) => (v > 0 ? v : "") } as any}
                  />
                  <Bar dataKey="a" name="Assists" fill={COLOR.amber} radius={[0, 4, 4, 0]} barSize={open.sc ? 10 : 14} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={titleStyle(COLOR.cyan, 16)}>Goal Pace by Matchday (WC Comparison)</div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={paceByMatchday} margin={{ left: 10, right: 20, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLOR.border} />
                  <XAxis dataKey="md" tick={{ fill: COLOR.text, fontSize: 10 }} />
                  <YAxis domain={[2, 3.3]} tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Line type="monotone" dataKey="2026" stroke={COLOR.gold} strokeWidth={3} dot={{ fill: COLOR.gold, r: 5 }} connectNulls />
                  <Line type="monotone" dataKey="2022" stroke={COLOR.green} strokeWidth={2} dot={{ fill: COLOR.green, r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="2018" stroke={COLOR.blue} strokeWidth={1.5} dot={{ fill: COLOR.blue, r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="2014" stroke={COLOR.amber} strokeWidth={1.5} dot={{ fill: COLOR.amber, r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="2010" stroke={COLOR.purple} strokeWidth={1.5} dot={{ fill: COLOR.purple, r: 3 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={titleStyle(COLOR.green, 14)}>Goals Per Game by Tournament (normalized)</div>
            <div style={{ height: 180 }}>
              <ResponsiveContainer>
                <BarChart data={gpgByTournament} margin={{ left: 10, right: 10, bottom: 5 }}>
                  <XAxis dataKey="yr" tick={{ fill: COLOR.text, fontSize: 9 }} />
                  <YAxis domain={[0, 3.5]} tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <Tooltip {...tooltipStyle} formatter={((v: any) => [v.toFixed(2) + " /game", "Rate"]) as any} />
                  <Bar
                    dataKey="gpg"
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                    label={{ position: "top", fill: COLOR.text, fontSize: 8, formatter: (v: any) => v.toFixed(2) } as any}
                  >
                    {gpgByTournament.map((e, i) => (
                      <Cell key={i} fill={e.yr === "2026" ? COLOR.gold : e.yr === "2022" ? COLOR.green : COLOR.blue} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={titleStyle(COLOR.red, 14)}>When Goals Are Scored (% of total)</div>
            <div style={{ color: COLOR.muted, fontSize: 9, marginBottom: 4 }}>
              28% in final 15 min. 2.3x the opening 15 (12%). 2nd half produces 54%.
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer>
                <BarChart data={goalIntervals} margin={{ left: 10, right: 10, bottom: 5 }}>
                  <XAxis dataKey="interval" tick={{ fill: COLOR.text, fontSize: 10 }} />
                  <YAxis tick={{ fill: COLOR.muted, fontSize: 9 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip {...tooltipStyle} formatter={((v: any) => [`${v}%`, "Share"]) as any} />
                  <Bar
                    dataKey="pct"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                    label={{ position: "top", fill: COLOR.text, fontSize: 10, fontWeight: 700, formatter: (v: any) => `${v}%` } as any}
                  >
                    {goalIntervals.map((_, i) => (
                      <Cell key={i} fill={i === 5 ? COLOR.red : i === 2 ? COLOR.amber : COLOR.blue} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={titleStyle(COLOR.gold, 12)}>All 187 Goals: Go-Ahead vs Equalizer vs Other</div>
            <div style={{ color: COLOR.muted, fontSize: 9, marginBottom: 4 }}>
              Every goal plotted by minute (X) and matchday (Y). Gold = go-ahead. Cyan = equalizer. Gray = other. Named dots are key scorers.
            </div>
            <div style={{ height: 320 }}>
              <ResponsiveContainer>
                <ScatterChart margin={{ left: 10, right: 20, top: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLOR.border} />
                  <XAxis
                    type="number"
                    dataKey="min"
                    tick={{ fill: COLOR.text, fontSize: 9 }}
                    domain={[0, 100]}
                    ticks={[0, 15, 30, 45, 60, 75, 90]}
                    label={{ value: "Minute", position: "bottom", offset: 8, fill: COLOR.muted, fontSize: 9 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="md"
                    tick={{ fill: COLOR.muted, fontSize: 9 }}
                    domain={[0.5, 3.5]}
                    ticks={[1, 2, 3]}
                    tickFormatter={(v) => `MD${v}`}
                    label={{ value: "Matchday", angle: -90, position: "insideLeft", fill: COLOR.muted, fontSize: 9 }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={((props: any) => {
                      const { active, payload } = props
                      if (!active || !payload?.length) return null
                      const r = payload[0]?.payload
                      const n = r?.type === "goahead" ? COLOR.gold : r?.type === "equalizer" ? COLOR.cyan : "#556"
                      const label = r?.type === "goahead" ? "GO-AHEAD" : r?.type === "equalizer" ? "EQUALIZER" : "OTHER"
                      return (
                        <div style={{ background: COLOR.panel, border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: "8px 12px", fontFamily: FONT }}>
                          <div style={{ color: n, fontWeight: 700, fontSize: 13 }}>{label}</div>
                          <div style={{ color: COLOR.text, fontSize: 11 }}>
                            {r?.p ? `${r.p} (${r.t})` : r?.t} {r?.min}'
                          </div>
                          <div style={{ color: COLOR.muted, fontSize: 10 }}>Matchday {r?.md}</div>
                        </div>
                      )
                    }) as any}
                  />
                  <Scatter
                    data={goalTimeline}
                    shape={((props: any) => {
                      const { cx, cy, payload } = props
                      const isGoahead = payload.type === "goahead"
                      const isEq = payload.type === "equalizer"
                      const n = isGoahead ? COLOR.gold : isEq ? COLOR.cyan : "#3d4a5c"
                      const r = payload.p ? (isGoahead || isEq ? 6 : 4) : isGoahead || isEq ? 4 : 2.5
                      const op = payload.type === "other" ? 0.3 : isGoahead ? 0.7 : 0.8
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={r} fill={n} fillOpacity={op} stroke={n} strokeWidth={payload.p ? 1.5 : 0.5} />
                          {payload.p && (isGoahead || isEq) && (
                            <text x={cx} y={cy - r - 3} textAnchor="middle" fill={n} fontSize={6} fontWeight={600}>
                              {payload.p}
                            </text>
                          )}
                        </g>
                      )
                    }) as any}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 12, margin: "6px 0" }}>
              {[
                { c: COLOR.gold, l: `Go-ahead (${goalTimeline.filter((g) => g.type === "goahead").length}, ${Math.round((goalTimeline.filter((g) => g.type === "goahead").length / 187) * 100)}%)` },
                { c: COLOR.cyan, l: `Equalizer (${goalTimeline.filter((g) => g.type === "equalizer").length}, ${Math.round((goalTimeline.filter((g) => g.type === "equalizer").length / 187) * 100)}%)` },
                { c: "#3d4a5c", l: `Other (${goalTimeline.filter((g) => g.type === "other").length}, ${Math.round((goalTimeline.filter((g) => g.type === "other").length / 187) * 100)}%)` },
              ].map((e, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 5, background: e.c }} />
                  <span style={{ color: COLOR.text, fontSize: 9 }}>{e.l}</span>
                </span>
              ))}
            </div>

            <Methodology
              text="Goals/game normalized for match count. Pace chart shows 5 WCs across matchdays. Intervals as % of first 100 goals (ESPN). Scatter: gold = go-ahead, cyan = equalizer."
              src="FIFA.com, ESPN, FBref, TheStatsAPI"
            />
          </div>
        )}

        {/* ---------------- Tab 1: Club Power ---------------- */}
        {tab === 1 && (
          <div>
            <div style={gridStyle}>
              <Stat l="Most efficient" v="RM 2.50" sub="10G from 4 players" c={COLOR.green} />
              <Stat l="Surprise" v="C.Palace 1.50" sub="6G, 3 different countries" c={COLOR.amber} />
              <Stat l="Volume floor" v="Arsenal 0.25" sub="16 players, 4 goals" c={COLOR.red} />
              <Stat l="Cult hero" v="Motherwell 2.0" sub="E.Just(2) for NZL" c={COLOR.purple} />
            </div>
            <div style={{ height: 24 * clubPower.length + 40 }}>
              <ResponsiveContainer>
                <BarChart data={[...clubPower].sort((a, b) => b.r - a.r)} layout="vertical" margin={{ left: 90, right: 40 }}>
                  <XAxis type="number" domain={[0, 3]} tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <YAxis type="category" dataKey="c" tick={{ fill: COLOR.text, fontSize: 10 }} width={85} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={((v: any) => [v.toFixed(2), "G/Player"]) as any}
                    labelFormatter={((label: any) => {
                      const row = clubPower.find((c) => c.c === label)
                      return `${label}: ${row?.g}G from ${row?.p} players\n${row?.t}`
                    }) as any}
                  />
                  <Bar
                    dataKey="r"
                    radius={[0, 5, 5, 0]}
                    barSize={14}
                    label={{ position: "right", fill: COLOR.text, fontSize: 9, fontWeight: 600, formatter: (v: any) => v.toFixed(2) } as any}
                  >
                    {[...clubPower]
                      .sort((a, b) => b.r - a.r)
                      .map((e, i) => (
                        <Cell key={i} fill={e.r >= 2 ? COLOR.gold : e.r >= 1 ? COLOR.green : e.r >= 0.5 ? COLOR.blue : COLOR.purple} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Methodology
              text="G/Player = Total WC goals by club's players / players sent. RM and Inter Miami tie at 2.50 for different reasons: RM has 4 stars, Miami has 1 (Messi scoring 100% of their goals)."
              src="FIFA.com, Transfermarkt, FBref"
            />
          </div>
        )}

        {/* ---------------- Tab 2: Dual Nationals ---------------- */}
        {tab === 2 && (
          <div>
            <div style={gridStyle}>
              <Stat l="France-born at WC" v="~100" sub="Only 23 play for France" c={COLOR.blue} />
              <Stat l="Brother splits" v="3 pairs" sub="Doue, Williams, Souttar" c={COLOR.purple} />
              <Stat l="Late switch" v="Bouaddi" sub="FRA U21 cap to MAR" c={COLOR.red} />
            </div>
            <div style={titleStyle(COLOR.cyan)}>Birth Country Export</div>
            <div style={{ height: 28 * birthExport.length + 40 }}>
              <ResponsiveContainer>
                <BarChart data={birthExport} layout="vertical" margin={{ left: 80, right: 20 }}>
                  <XAxis type="number" tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <YAxis type="category" dataKey="c" tick={{ fill: COLOR.text, fontSize: 10 }} width={75} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="playing" name="Playing for" stackId="a" fill={COLOR.green} barSize={16} />
                  <Bar dataKey="exported" name="Exported" stackId="a" fill={COLOR.red} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {[...dualNationals]
              .sort((a, b) => b.g - a.g)
              .map((e, i) => (
                <Card
                  key={i}
                  glow={e.g > 0}
                  onClick={() => setDetail({ t: e.p, b: `Chose: ${e.ch}\nCould have: ${e.alt}\nWC Goals: ${e.g}`, s: "FIFA eligibility, ESPN" })}
                  style={{ marginBottom: 3 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ color: e.g > 0 ? COLOR.green : COLOR.text, fontWeight: 700, fontSize: 11 }}>{e.p}</span>
                      <span style={{ color: COLOR.muted, fontSize: 9, marginLeft: 6 }}>
                        chose {e.ch} over {e.alt}
                      </span>
                    </div>
                    {e.g > 0 && <span style={{ color: COLOR.gold, fontWeight: 700 }}>{e.g}G</span>}
                  </div>
                </Card>
              ))}
          </div>
        )}

        {/* ---------------- Tab 3: Squad ROI ---------------- */}
        {tab === 3 && (
          <div>
            <div style={gridStyle}>
              <Stat l="Best ROI" v="Cape Verde 10" sub="101x budget gap vs Spain" c={COLOR.green} />
              <Stat l="Worst ROI" v="Iraq 0.5" sub="0 pts, -8 GD" c={COLOR.red} />
              <Stat l="Total value" v="€17.57B" sub="Top 4 = 29%" c={COLOR.blue} />
            </div>
            <Toggle show={!!open.roi} fn={() => toggle("roi")} total={squadROI.length} top={16} />
            {(() => {
              const sorted = [...squadROI].sort((a, b) => b.roi - a.roi)
              const rows = open.roi ? sorted : sorted.slice(0, 16)
              return (
                <div style={{ height: 22 * rows.length + 40 }}>
                  <ResponsiveContainer>
                    <BarChart data={rows} layout="vertical" margin={{ left: 80, right: 40 }}>
                      <XAxis type="number" domain={[0, 10.5]} tick={{ fill: COLOR.muted, fontSize: 9 }} />
                      <YAxis type="category" dataKey="t" tick={{ fill: COLOR.text, fontSize: 10 }} width={75} />
                      <Tooltip
                        {...tooltipStyle}
                        formatter={((v: any) => [`${v}/10`, "ROI"]) as any}
                        labelFormatter={((label: any) => {
                          const row = squadROI.find((t) => t.t === label)
                          return `${label} | €${row?.v}M | FIFA #${row?.f}\nGrp ${row?.gp}: ${row?.pts}pts, GD ${row && row.gd > 0 ? "+" : ""}${row?.gd}`
                        }) as any}
                      />
                      <Bar dataKey="roi" radius={[0, 5, 5, 0]} barSize={13} label={{ position: "right", fill: COLOR.text, fontSize: 9, fontWeight: 600 } as any}>
                        {rows.map((e, i) => (
                          <Cell key={i} fill={roiColor(e.roi)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )
            })()}
            <div style={titleStyle(COLOR.cyan, 14)}>Bubble: Value (size) vs ROI (position)</div>
            <div style={{ height: 340 }}>
              <ResponsiveContainer>
                <ScatterChart margin={{ left: 10, right: 30, top: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLOR.border} />
                  <XAxis
                    type="number"
                    dataKey="v"
                    tick={{ fill: COLOR.muted, fontSize: 9 }}
                    reversed
                    domain={[0, 1600]}
                    label={{ value: "Expensive ←          Lean →", position: "bottom", offset: 10, fill: COLOR.muted, fontSize: 9 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="roi"
                    tick={{ fill: COLOR.muted, fontSize: 9 }}
                    domain={[0, 10.5]}
                    label={{ value: "ROI (/10)", angle: -90, position: "insideLeft", fill: COLOR.muted, fontSize: 9 }}
                  />
                  <ZAxis type="number" dataKey="v" range={[30, 400]} />
                  <Tooltip
                    content={((props: any) => {
                      const { active, payload } = props
                      if (!active || !payload?.length) return null
                      const r = payload[0]?.payload
                      return (
                        <div style={{ background: COLOR.panel, border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: "8px 12px", fontFamily: FONT }}>
                          <div style={{ color: COLOR.green, fontWeight: 700, fontSize: 13 }}>{r?.t}</div>
                          <div style={{ color: COLOR.text, fontSize: 11 }}>
                            €{r?.v}M | ROI: {r?.roi}/10
                          </div>
                          <div style={{ color: COLOR.muted, fontSize: 10 }}>
                            FIFA #{r?.f} | {r?.pts}pts
                          </div>
                        </div>
                      )
                    }) as any}
                  />
                  <Scatter
                    data={squadROI.filter((e) => e.v > 10)}
                    shape={((props: any) => {
                      const { cx, cy, payload } = props
                      const n = roiColor(payload.roi)
                      const radius = Math.max(6, Math.min(32, 1.1 * Math.sqrt(payload.v)))
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={radius} fill={n} fillOpacity={0.55} stroke={n} strokeWidth={1.5} />
                          {payload.v >= 80 && (
                            <text x={cx} y={cy + 1} textAnchor="middle" fill="#fff" fontSize={radius > 14 ? 8 : 6} fontWeight={600} dominantBaseline="middle">
                              {payload.t.slice(0, 5)}
                            </text>
                          )}
                        </g>
                      )
                    }) as any}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <Methodology
              text="ROI = Points (35%) + GD (25%) + Value efficiency (25%) + FIFA overperformance (15%). Bubble X inverted: up-right = dream (lean + high ROI). Down-left = wasted spend."
              src="Transfermarkt, FIFA.com"
            />
          </div>
        )}

        {/* ---------------- Tab 4: Fan Markets ---------------- */}
        {tab === 4 && (
          <div>
            <div style={gridStyle}>
              <Stat l="Total int'l visitors" v="2.6M" sub="Avg $5,000+/person" c={COLOR.green} />
              <Stat l="Highest city impact" v="Atlanta $1B" sub="8 matches + semifinal" c={COLOR.gold} />
              <Stat l="Biggest hotel spike" v="Dallas 1,400%" sub="5x any Super Bowl" c={COLOR.amber} />
              <Stat l="Total impact" v="$9.1B" sub="US/MEX/CAN combined" c={COLOR.blue} />
            </div>
            <div style={titleStyle(COLOR.green)}>Host City Demand Index</div>
            <div style={{ height: 24 * fanMarkets.length + 30 }}>
              <ResponsiveContainer>
                <BarChart data={[...fanMarkets].sort((a, b) => b.demand - a.demand)} layout="vertical" margin={{ left: 80, right: 30 }}>
                  <XAxis type="number" domain={[0, 10]} tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <YAxis type="category" dataKey="city" tick={{ fill: COLOR.text, fontSize: 10 }} width={75} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={((v: any) => [v + "/10", "Demand"]) as any}
                    labelFormatter={((label: any) => {
                      const row = fanMarkets.find((c) => c.city === label)
                      return `${label} | ${row?.impact} | Hotel: ${row?.hotel}\nTop fans: ${row?.fans}`
                    }) as any}
                  />
                  <Bar dataKey="demand" radius={[0, 5, 5, 0]} barSize={15} label={{ position: "right", fill: COLOR.text, fontSize: 9 } as any}>
                    {[...fanMarkets]
                      .sort((a, b) => b.demand - a.demand)
                      .map((e, i) => (
                        <Cell key={i} fill={e.demand >= 9 ? COLOR.gold : e.demand >= 8 ? COLOR.green : COLOR.blue} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={titleStyle(COLOR.blue, 12)}>Top Fan Nations by Travel Demand</div>
            <div style={{ height: 22 * fanNations.length + 30 }}>
              <ResponsiveContainer>
                <BarChart data={fanNations} layout="vertical" margin={{ left: 80, right: 30 }}>
                  <XAxis type="number" domain={[0, 10.5]} tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <YAxis type="category" dataKey="n" tick={{ fill: COLOR.text, fontSize: 10 }} width={75} />
                  <Tooltip {...tooltipStyle} formatter={((v: any) => [v + "/10", "Demand"]) as any} />
                  <Bar dataKey="d" radius={[0, 5, 5, 0]} barSize={14} label={{ position: "right", fill: COLOR.text, fontSize: 9 } as any}>
                    {fanNations.map((e, i) => (
                      <Cell key={i} fill={e.type === "Domestic" ? COLOR.cyan : e.type === "Cross-border" ? COLOR.purple : COLOR.green} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Methodology
              text="City Demand = Hotel spike (30%) + Economic impact (25%) + Int'l visitor volume (25%) + Match significance (20%). Fan nations ranked by booking volume and ticket purchases."
              src="Tourism Economics, FIFA/WTO, US Travel Association"
            />
          </div>
        )}

        {/* ---------------- Tab 5: Confederations ---------------- */}
        {tab === 5 && (
          <div>
            <div style={gridStyle}>
              <Stat l="Biggest growth" v="CAF +100%" sub="10 teams (was 5 in 2022)" c={COLOR.amber} />
              <Stat l="Highest adv. rate" v="CONMEBOL 83%" sub="5 of 6 through" c={COLOR.green} />
              <Stat l="Shock exit" v="Uruguay" sub="2x champs eliminated" c={COLOR.red} />
            </div>
            <div style={titleStyle(COLOR.purple)}>Representation Growth (2010-2026)</div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={confedGrowth} margin={{ left: 10, right: 10, bottom: 5 }}>
                  <XAxis dataKey="yr" tick={{ fill: COLOR.text, fontSize: 10 }} />
                  <YAxis tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="UEFA" stackId="a" fill="#3b82f6" barSize={30} />
                  <Bar dataKey="CAF" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="AFC" stackId="a" fill="#ef4444" />
                  <Bar dataKey="CONMEBOL" stackId="a" fill="#10b981" />
                  <Bar dataKey="CONCACAF" stackId="a" fill="#a855f7" />
                  <Bar dataKey="OFC" stackId="a" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={titleStyle(COLOR.green, 12)}>Group Stage W/D/L by Confederation</div>
            <div style={{ height: 180 }}>
              <ResponsiveContainer>
                <BarChart data={confeds} layout="vertical" margin={{ left: 80, right: 20 }}>
                  <XAxis type="number" tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <YAxis type="category" dataKey="conf" tick={{ fill: COLOR.text, fontSize: 10 }} width={75} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="w" name="Wins" stackId="a" fill={COLOR.green} barSize={16} />
                  <Bar dataKey="d" name="Draws" stackId="a" fill={COLOR.amber} />
                  <Bar dataKey="l" name="Losses" stackId="a" fill={COLOR.red} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {confeds.map((e, i) => (
              <Card
                key={i}
                onClick={() =>
                  setDetail({
                    t: `${e.conf} at WC 2026`,
                    b: `Teams: ${e.teams}\n${e.w}W ${e.d}D ${e.l}L\nAdvanced: ${e.adv}/${e.teams} (${Math.round((e.adv / e.teams) * 100)}%)`,
                    s: "FIFA.com",
                  })
                }
                style={{ marginBottom: 3 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: e.color }} />
                    <span style={{ color: COLOR.text, fontWeight: 700, fontSize: 12 }}>{e.conf}</span>
                    <span style={{ color: COLOR.muted, fontSize: 9 }}>{e.teams} teams</span>
                  </div>
                  <span style={{ color: COLOR.text, fontWeight: 700 }}>
                    {e.adv}/{e.teams} adv ({Math.round((e.adv / e.teams) * 100)}%)
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ---------------- Tab 6: Groups ---------------- */}
        {tab === 6 && (
          <div>
            <div style={{ height: 24 * groups.length + 30 }}>
              <ResponsiveContainer>
                <BarChart data={[...groups].sort((a, b) => b.diff - a.diff)} layout="vertical" margin={{ left: 55, right: 30 }}>
                  <XAxis type="number" domain={[0, 10]} tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <YAxis type="category" dataKey="g" tick={{ fill: COLOR.text, fontSize: 11 }} width={50} tickFormatter={(v) => `Grp ${v}`} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={((v: any) => [v + "/10", "Difficulty"]) as any}
                    labelFormatter={((label: any) => {
                      const row = groups.find((g) => g.g === label)
                      return `Group ${label}\n${row?.teams}\n€${row?.val}M`
                    }) as any}
                  />
                  <Bar
                    dataKey="diff"
                    radius={[0, 6, 6, 0]}
                    barSize={18}
                    label={{ position: "right", fill: COLOR.text, fontSize: 10, fontWeight: 600 } as any}
                  >
                    {[...groups]
                      .sort((a, b) => b.diff - a.diff)
                      .map((e, i) => (
                        <Cell key={i} fill={e.diff >= 8 ? COLOR.red : e.diff >= 6 ? COLOR.amber : COLOR.green} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {[...groups]
              .sort((a, b) => b.diff - a.diff)
              .map((e, i) => (
                <Card
                  key={i}
                  onClick={() => setDetail({ t: `Group ${e.g}`, b: `Teams: ${e.teams}\nValue: €${e.val}M\nDifficulty: ${e.diff}/10`, s: "Transfermarkt, FIFA" })}
                  style={{ marginBottom: 3 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ color: e.diff >= 8 ? COLOR.red : COLOR.amber, fontWeight: 700, fontSize: 12 }}>Grp {e.g}</span>
                      <span style={{ color: COLOR.muted, fontSize: 9, marginLeft: 8 }}>{e.teams}</span>
                    </div>
                    <div>
                      <span style={{ color: COLOR.text, fontWeight: 700 }}>{e.diff}</span>
                      <span style={{ color: COLOR.muted, fontSize: 8 }}>/10 | €{e.val}M</span>
                    </div>
                  </div>
                </Card>
              ))}
            <Methodology
              text="Difficulty = Team value (30%) + FIFA ranking delta (25%) + Competitive balance (25%) + Star-player factor (20%). Group I (FRA/NOR) is 2026's Group of Death."
              src="FIFA.com, Transfermarkt"
            />
          </div>
        )}

        {/* ---------------- Tab 7: Route Index ---------------- */}
        {tab === 7 && (
          <div>
            <div style={gridStyle}>
              <Stat l="Easiest route" v="France 6" sub="Group I W, plays 3rd" c={COLOR.green} />
              <Stat l="Hardest route" v="Spain 19" sub="Grp H, then Grp J 2nd" c={COLOR.red} />
              <Stat l="Travel burden" v="Curacao 10K" sub="Most km per match" c={COLOR.cyan} />
            </div>
            <div style={{ height: 22 * routeIndex.length + 40 }}>
              <ResponsiveContainer>
                <BarChart data={routeIndex} layout="vertical" margin={{ left: 80, right: 40 }}>
                  <XAxis type="number" domain={[0, 20]} tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <YAxis type="category" dataKey="t" tick={{ fill: COLOR.text, fontSize: 10 }} width={75} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={((v: any) => [v, "Difficulty"]) as any}
                    labelFormatter={((label: any) => {
                      const row = routeIndex.find((r) => r.t === label)
                      return `${label}\n${row?.st} → R32: ${row?.r32}\nTravel: ${row?.tr} | Opponent: ${row?.op} | Bracket: ${row?.br} | Fatigue: ${row?.fa}`
                    }) as any}
                  />
                  <Bar dataKey="tot" radius={[0, 5, 5, 0]} barSize={14} label={{ position: "right", fill: COLOR.text, fontSize: 9, fontWeight: 600 } as any}>
                    {routeIndex.map((e, i) => (
                      <Cell key={i} fill={e.tot <= 9 ? COLOR.green : e.tot <= 12 ? COLOR.blue : e.tot <= 15 ? COLOR.amber : COLOR.red} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={titleStyle(COLOR.cyan, 14)}>Avg Travel per Match (km)</div>
            <div style={{ height: 22 * travelKm.length + 30 }}>
              <ResponsiveContainer>
                <BarChart data={travelKm} layout="vertical" margin={{ left: 70, right: 50 }}>
                  <XAxis type="number" tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <YAxis type="category" dataKey="t" tick={{ fill: COLOR.text, fontSize: 10 }} width={65} />
                  <Tooltip {...tooltipStyle} formatter={((v: any) => [`${v.toLocaleString()} km`, "Avg/match"]) as any} />
                  <Bar
                    dataKey="km"
                    radius={[0, 5, 5, 0]}
                    barSize={14}
                    label={{ position: "right", fill: COLOR.text, fontSize: 9, formatter: (v: any) => `${v.toLocaleString()} km` } as any}
                  >
                    {travelKm.map((e, i) => (
                      <Cell key={i} fill={e.km >= 7000 ? COLOR.red : e.km >= 4000 ? COLOR.amber : COLOR.green} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Methodology
              text="Route Index = Travel (25%) + Opponent quality (30%) + Bracket path (25%) + Fixture congestion (20%). France gets the dream draw: weak group, plays a 3rd-place team in R32, minimal travel."
              src="FIFA.com, Transfermarkt, venue distances"
            />
          </div>
        )}

        {/* ---------------- Tab 8: Venues ---------------- */}
        {tab === 8 && (
          <div>
            <div style={gridStyle}>
              <Stat l="Highest GPG" v="Vancouver 3.67" sub="22 goals in 6 matches" c={COLOR.green} />
              <Stat l="Most goals" v="LA 26" sub="8 matches, 3.25/game" c={COLOR.gold} />
              <Stat l="Most matches" v="Dallas 9" sub="25 goals (2.78/game)" c={COLOR.blue} />
            </div>
            <div style={{ height: 22 * venues.length + 30 }}>
              <ResponsiveContainer>
                <BarChart data={[...venues].sort((a, b) => b.gpg - a.gpg)} layout="vertical" margin={{ left: 70, right: 50 }}>
                  <XAxis type="number" domain={[0, 4]} tick={{ fill: COLOR.muted, fontSize: 9 }} />
                  <YAxis type="category" dataKey="city" tick={{ fill: COLOR.text, fontSize: 10 }} width={65} />
                  <Tooltip
                    {...tooltipStyle}
                    formatter={((v: any) => [v.toFixed(2), "Goals/game"]) as any}
                    labelFormatter={((label: any) => {
                      const row = venues.find((v) => v.city === label)
                      return `${label}: ${row?.goals} goals in ${row?.matches} matches`
                    }) as any}
                  />
                  <Bar
                    dataKey="gpg"
                    radius={[0, 5, 5, 0]}
                    barSize={14}
                    label={{ position: "right", fill: COLOR.text, fontSize: 9, fontWeight: 600, formatter: (v: any) => v.toFixed(2) } as any}
                  >
                    {[...venues]
                      .sort((a, b) => b.gpg - a.gpg)
                      .map((e, i) => (
                        <Cell key={i} fill={e.gpg >= 3.2 ? COLOR.gold : e.gpg >= 2.7 ? COLOR.green : COLOR.blue} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Methodology
              text="Goals per game by venue through group stage. Vancouver leads (3.67) driven by high-scoring Group F matches. US venues average 2.89/game vs Mexico 2.38/game."
              src="FIFA.com, venue records"
            />
          </div>
        )}

        {/* ---------------- Tab 9: Possession ---------------- */}
        {tab === 9 && (
          <div>
            <div style={gridStyle}>
              <Stat l="Highest possession" v="Spain 62%" sub="7 pts, 5-0 GD" c={COLOR.green} />
              <Stat l="Lowest possession" v="Curacao 32%" sub="1 pt, 2-9 GD" c={COLOR.red} />
              <Stat l="Counter-attack kings" v="France 52%" sub="9 pts, 10 GF. Less ball, more goals" c={COLOR.gold} />
              <Stat l="Response goals" v="11" sub="Goals within 5 min of conceding" c={COLOR.cyan} />
            </div>

            <div style={titleStyle(COLOR.green)}>Possession vs Points (Group Stage)</div>
            <div style={{ height: 340 }}>
              <ResponsiveContainer>
                <ScatterChart margin={{ left: 10, right: 30, top: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLOR.border} />
                  <XAxis
                    type="number"
                    dataKey="poss"
                    tick={{ fill: COLOR.text, fontSize: 9 }}
                    domain={[30, 65]}
                    label={{ value: "Avg Possession %", position: "bottom", offset: 8, fill: COLOR.muted, fontSize: 9 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="pts"
                    tick={{ fill: COLOR.muted, fontSize: 9 }}
                    domain={[0, 10]}
                    label={{ value: "Points", angle: -90, position: "insideLeft", fill: COLOR.muted, fontSize: 9 }}
                  />
                  <Tooltip
                    content={((props: any) => {
                      const { active, payload } = props
                      if (!active || !payload?.length) return null
                      const r = payload[0]?.payload
                      return (
                        <div style={{ background: COLOR.panel, border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: "8px 12px", fontFamily: FONT }}>
                          <div style={{ color: r?.adv ? COLOR.green : COLOR.red, fontWeight: 700, fontSize: 13 }}>{r?.t}</div>
                          <div style={{ color: COLOR.text, fontSize: 11 }}>{r?.poss}% possession | {r?.pts} pts</div>
                          <div style={{ color: COLOR.muted, fontSize: 10 }}>{r?.result} | {r?.gf}-{r?.ga} GD</div>
                          <div style={{ color: r?.adv ? COLOR.green : COLOR.red, fontSize: 9, marginTop: 2 }}>{r?.adv ? "Advanced" : "Eliminated"}</div>
                        </div>
                      )
                    }) as any}
                  />
                  <Scatter
                    data={possession}
                    shape={((props: any) => {
                      const { cx, cy, payload } = props
                      const n = payload.adv ? COLOR.green : COLOR.red
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={7} fill={n} fillOpacity={0.7} stroke={n} strokeWidth={1.5} />
                          <text x={cx} y={cy - 10} textAnchor="middle" fill={COLOR.text} fontSize={7} fontWeight={600}>
                            {payload.t}
                          </text>
                        </g>
                      )
                    }) as any}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "flex", gap: 12, margin: "6px 0 12px" }}>
              {[
                { c: COLOR.green, l: "Advanced" },
                { c: COLOR.red, l: "Eliminated" },
              ].map((e, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 5, background: e.c }} />
                  <span style={{ color: COLOR.text, fontSize: 9 }}>{e.l}</span>
                </span>
              ))}
            </div>

            <div style={titleStyle(COLOR.cyan, 14)}>Response Goals (scored within 5 min of conceding)</div>
            {responseGoals.map((e, i) => (
              <Card
                key={i}
                glow={e.type === "equalizer"}
                onClick={() => setDetail({ t: `${e.match} — ${e.team}`, b: `${e.context}\n\nType: ${e.type}\nResponse time: ${e.gap} min`, s: "FIFA.com, ESPN" })}
                style={{ marginBottom: 3 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ color: e.type === "equalizer" ? COLOR.cyan : e.type === "insurance" ? COLOR.gold : COLOR.muted, fontWeight: 700, fontSize: 11 }}>
                      {e.match}
                    </span>
                    <span style={{ color: COLOR.muted, fontSize: 9, marginLeft: 6 }}>{e.team} {e.min}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: COLOR.text, fontSize: 9 }}>{e.gap}min</span>
                    <span
                      style={{
                        fontSize: 8,
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: 4,
                        background: e.type === "equalizer" ? COLOR.cyan : e.type === "insurance" ? COLOR.gold : COLOR.muted,
                        color: COLOR.bg,
                      }}
                    >
                      {e.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}

            <Methodology
              text="Possession averaged across 3 group-stage matches. Response goals = scored within 5 minutes of the opponent scoring. Scatter: green = advanced to R32, red = eliminated. France's 52% shows you don't need the ball to dominate."
              src="FIFA.com, ESPN, FBref"
            />
          </div>
        )}

        {/* Footer */}
        <div style={{ color: COLOR.muted, fontSize: 8, marginTop: 20, textAlign: "center", borderTop: `1px solid ${COLOR.border}`, paddingTop: 8 }}>
          FIFA.com | ESPN | Transfermarkt | FBref | IMF | Tourism Economics | SI | Covers | Sky Sports
        </div>
      </div>
    </div>
  )
}
