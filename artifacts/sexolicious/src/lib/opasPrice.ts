import { useSyncExternalStore } from "react";

/**
 * Live $OPAS / USDT price engine (client-side simulation).
 *
 * $OPAS is the platform trading currency: capital flows IN as $OPAS and yield
 * distributions flow OUT as USDT. This module produces a mean-reverting random
 * walk so the quoted rate visibly ticks up and down in real time. It is a
 * singleton shared across every component (and the price keeps moving even when
 * no component is mounted-and-listening, on the next subscribe it resumes from
 * the last persisted value).
 *
 * 1 USDT is treated as 1 USD, so USD asset totals convert to $OPAS via
 * `usdToOpas(usd, price)`.
 */

const KEY = "opas:price:v1";
const BASE = 2.5; // USDT per OPAS — soft anchor the walk reverts toward
const MIN = BASE * 0.6;
const MAX = BASE * 1.65;
const VOL = 0.006; // per-tick volatility
const THETA = 0.025; // mean-reversion strength toward BASE
const TICK_MS = 1200;
const HIST = 48; // sparkline window

export type OpasSnapshot = {
  price: number; // USDT per OPAS
  dayOpen: number; // first price of the current day (anchor for change %)
  changePct: number; // % vs day open
  dir: 1 | 0 | -1; // direction of the most recent tick
  history: number[]; // last HIST prices, oldest → newest
};

const todayKey = () => new Date().toISOString().slice(0, 10);

let price = BASE;
let prev = BASE;
let dayOpen = BASE;
let dayKey = todayKey();
let history: number[] = [];
let snapshot: OpasSnapshot = {
  price,
  dayOpen,
  changePct: 0,
  dir: 0,
  history: [],
};

let initialized = false;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ price, dayOpen, dayKey, ts: Date.now() }),
    );
  } catch {
    /* storage unavailable — keep running in-memory */
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const o = JSON.parse(raw) as Partial<{
        price: number;
        dayOpen: number;
        dayKey: string;
      }>;
      if (Number.isFinite(o.price)) price = Math.min(MAX, Math.max(MIN, o.price as number));
      if (Number.isFinite(o.dayOpen) && (o.dayOpen as number) > 0) dayOpen = o.dayOpen as number;
      dayKey = typeof o.dayKey === "string" ? o.dayKey : todayKey();
    }
  } catch {
    /* ignore malformed state */
  }
  // New calendar day → reset the change-% anchor to the current price.
  if (dayKey !== todayKey()) {
    dayKey = todayKey();
    dayOpen = price;
  }
  prev = price;
  history = Array.from({ length: HIST }, () => price);
  build();
}

function build() {
  const changePct = dayOpen > 0 ? ((price - dayOpen) / dayOpen) * 100 : 0;
  const dir: 1 | 0 | -1 = price > prev ? 1 : price < prev ? -1 : 0;
  snapshot = { price, dayOpen, changePct, dir, history };
}

function tick() {
  prev = price;
  // Ornstein–Uhlenbeck-style step: pull toward BASE + proportional noise.
  const drift = THETA * (BASE - price);
  const shock = price * VOL * (Math.random() * 2 - 1);
  price = Math.min(MAX, Math.max(MIN, price + drift + shock));

  if (dayKey !== todayKey()) {
    dayKey = todayKey();
    dayOpen = price;
  }

  history = [...history.slice(1), price];
  build();
  persist();
  listeners.forEach((l) => l());
}

function ensureRunning() {
  if (timer === null && typeof window !== "undefined") {
    timer = setInterval(tick, TICK_MS);
  }
}

function subscribe(cb: () => void) {
  if (!initialized) {
    load();
    initialized = true;
  }
  listeners.add(cb);
  ensureRunning();
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };
}

function getSnapshot(): OpasSnapshot {
  if (!initialized) {
    load();
    initialized = true;
  }
  return snapshot;
}

/** Live $OPAS/USDT snapshot. Re-renders the caller on every tick. */
export function useOpasPrice(): OpasSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Convert a USD (≈USDT) amount into the $OPAS needed at the given rate. */
export function usdToOpas(usd: number, price: number): number {
  return Number.isFinite(price) && price > 0 ? usd / price : 0;
}

/** Format an $OPAS amount, e.g. "412.50 OPAS". */
export function fmtOpas(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return (
    n.toLocaleString("en-US", {
      maximumFractionDigits: n >= 1000 ? 0 : 2,
      minimumFractionDigits: n >= 1000 ? 0 : 2,
    }) + " OPAS"
  );
}

/** Format the rate itself, e.g. "$2.531". */
export function fmtOpasRate(n: number): string {
  return "$" + n.toFixed(3);
}
