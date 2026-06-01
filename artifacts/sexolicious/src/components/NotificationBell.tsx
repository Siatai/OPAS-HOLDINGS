import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useAccount } from "wagmi";
import { Bell, Gavel, Heart, ArrowLeftRight, Check, X as XIcon } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
  type AppNotification,
} from "../lib/portfolio";

function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const NEVERA = { fontFamily: "Neuropol, sans-serif" };

export default function NotificationBell({ className = "" }: { className?: string }) {
  const { address, isConnected } = useAccount();
  const [, setLocation] = useLocation();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const refresh = useCallback(() => {
    setItems(address ? getNotifications(address) : []);
  }, [address]);

  // Load + keep live: react to in-app mutations, cross-tab storage writes,
  // and a slow poll so simulated arrivals appear without interaction.
  useEffect(() => {
    refresh();
    const onNotify = () => refresh();
    window.addEventListener("opas:notify", onNotify);
    window.addEventListener("storage", onNotify);
    const t = window.setInterval(refresh, 6000);
    return () => {
      window.removeEventListener("opas:notify", onNotify);
      window.removeEventListener("storage", onNotify);
      window.clearInterval(t);
    };
  }, [refresh]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!isConnected) return null;

  const unread = items.reduce((n, x) => n + (x.read ? 0 : 1), 0);

  const onOpen = (n: AppNotification) => {
    if (address) markNotificationRead(address, n);
    setOpen(false);
    setLocation(n.href);
  };

  const onMarkAll = () => {
    if (address) markAllNotificationsRead(address);
    refresh();
  };

  const onDismiss = (n: AppNotification) => {
    if (address) dismissNotification(address, n);
    refresh();
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        data-testid="notif-bell"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        className="relative flex items-center justify-center w-9 h-9 rounded-sm border border-white/10 text-white/65 hover:text-secondary hover:border-secondary/40 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span
            data-testid="notif-badge"
            className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-secondary text-[#050810] text-[9px] font-bold font-mono leading-none"
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          data-testid="notif-panel"
          className="absolute right-0 mt-2 w-[320px] max-h-[70vh] overflow-y-auto rounded-lg shadow-2xl z-50"
          style={{ background: "rgba(8,12,24,0.97)", border: "1px solid rgba(220,225,235,0.10)", backdropFilter: "blur(18px)" }}
        >
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/8 sticky top-0" style={{ background: "rgba(8,12,24,0.97)" }}>
            <span className="text-[10px] tracking-[0.24em] uppercase text-white/70" style={NEVERA}>
              Notifications
            </span>
            {unread > 0 && (
              <button
                onClick={onMarkAll}
                data-testid="notif-mark-all"
                className="flex items-center gap-1 text-[8.5px] tracking-[0.2em] uppercase text-white/45 hover:text-secondary transition-colors"
                style={NEVERA}
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="px-3.5 py-6 text-[11px] text-white/45" style={NEVERA}>
              No notifications yet — bids, expressed interest and swap offers on your assets will appear here.
            </div>
          ) : (
            <div className="py-1">
              {items.map((n) => {
                const Icon = n.kind === "bid" ? Gavel : n.kind === "swap" ? ArrowLeftRight : Heart;
                const tone = n.kind === "bid" ? "text-primary" : n.kind === "swap" ? "text-secondary" : "text-rose-300";
                return (
                  <div
                    key={n.id}
                    data-testid={`notif-${n.id}`}
                    onClick={() => onOpen(n)}
                    className={`group relative flex items-start gap-2.5 px-3.5 py-2.5 cursor-pointer hover:bg-white/5 transition-colors ${n.read ? "" : "bg-secondary/5"}`}
                  >
                    {!n.read && <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-secondary" />}
                    <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${tone}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-white font-mono truncate">{n.from}</span>
                        <span className={`text-[7.5px] tracking-[0.2em] uppercase ${tone} font-mono shrink-0`}>{n.kind}</span>
                      </div>
                      <div className="text-[10.5px] text-white/60 leading-snug" style={NEVERA}>{n.note}</div>
                      <div className="text-[8.5px] text-white/30 font-mono mt-0.5">{timeAgo(n.createdAt)}</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDismiss(n); }}
                      data-testid={`notif-dismiss-${n.id}`}
                      className="text-white/25 hover:text-rose-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Dismiss notification"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
