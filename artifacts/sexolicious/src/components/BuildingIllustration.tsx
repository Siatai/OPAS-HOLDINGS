import React from "react";
import { motion } from "framer-motion";

/* Anime-style luxury apartment tower — vector illustration */
export default function BuildingIllustration() {
  /* Windows: [cx, cy, lit] — lit windows glow amber */
  const windows: [number, number, boolean][] = [
    // Tower upper floors
    [162,120,true],[190,120,false],[218,120,true],[246,120,false],
    [162,142,false],[190,142,true],[218,142,false],[246,142,true],
    [162,164,true],[190,164,true],[218,164,false],[246,164,false],
    [162,186,false],[190,186,false],[218,186,true],[246,186,true],
    [162,208,true],[190,208,false],[218,208,true],[246,208,false],
    [162,230,false],[190,230,true],[218,230,false],[246,230,true],
    [162,252,true],[190,252,false],[218,252,true],[246,252,false],
    [162,274,false],[190,274,true],[218,274,false],[246,274,false],
    [162,296,true],[190,296,false],[218,296,true],[246,296,true],
    [162,318,false],[190,318,true],[218,318,false],[246,318,false],
    [162,340,true],[190,340,false],[218,340,true],[246,340,true],
    // Podium floors
    [138,386,true],[166,386,false],[194,386,true],[222,386,true],[250,386,false],[278,386,true],
    [138,408,false],[166,408,true],[194,408,false],[222,408,false],[250,408,true],[278,408,false],
    [138,430,true],[166,430,false],[194,430,true],[222,430,false],[250,430,true],[278,430,false],
  ];

  /* BG buildings */
  const bgBuildings = [
    { x: 20, y: 240, w: 55, h: 280 },
    { x: 310, y: 200, w: 70, h: 320 },
    { x: 350, y: 300, w: 45, h: 220 },
  ];

  return (
    <svg
      viewBox="0 0 408 540"
      className="w-full h-full"
      style={{ overflow: "visible" }}
      aria-hidden
    >
      <defs>
        {/* Sky gradient */}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020510" />
          <stop offset="100%" stopColor="#0a1228" />
        </linearGradient>

        {/* Tower facade gradient */}
        <linearGradient id="tower" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0c1628" />
          <stop offset="50%" stopColor="#111d35" />
          <stop offset="100%" stopColor="#0a1220" />
        </linearGradient>

        {/* Podium gradient */}
        <linearGradient id="podium" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0e1a2e" />
          <stop offset="50%" stopColor="#131f38" />
          <stop offset="100%" stopColor="#0c1828" />
        </linearGradient>

        {/* Amber window glow */}
        <radialGradient id="winAmber" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EA8D0E" stopOpacity="1" />
          <stop offset="100%" stopColor="#b86a00" stopOpacity="0.4" />
        </radialGradient>

        {/* Teal accent glow */}
        <radialGradient id="tealGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0BB5BE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0BB5BE" stopOpacity="0" />
        </radialGradient>

        {/* Ground glow */}
        <radialGradient id="groundGlow" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="#EA8D0E" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#EA8D0E" stopOpacity="0" />
        </radialGradient>

        {/* Amber glow behind tower */}
        <radialGradient id="towerGlow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#EA8D0E" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#EA8D0E" stopOpacity="0" />
        </radialGradient>

        {/* Window soft glow filter */}
        <filter id="winGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Tower edge glow filter */}
        <filter id="softGlow" x="-30%" y="-10%" width="160%" height="120%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <clipPath id="scene">
          <rect x="0" y="0" width="408" height="540" />
        </clipPath>
      </defs>

      <g clipPath="url(#scene)">

        {/* ── Sky ── */}
        <rect x="0" y="0" width="408" height="540" fill="url(#sky)" />

        {/* Ambient tower glow (behind everything) */}
        <ellipse cx="204" cy="300" rx="160" ry="220" fill="url(#towerGlow)" />

        {/* ── Stars ── */}
        {[
          [40,30],[80,55],[120,20],[300,45],[350,25],[380,60],[30,90],[60,110],
          [340,80],[370,100],[390,40],[250,35],[200,15],[150,50],[90,35],
        ].map(([sx, sy], i) => (
          <motion.circle
            key={i} cx={sx} cy={sy} r={Math.random() > 0.5 ? 1 : 0.7}
            fill="white"
            initial={{ opacity: 0.2 + (i % 5) * 0.12 }}
            animate={{ opacity: [0.2 + (i % 5) * 0.12, 0.8, 0.2 + (i % 5) * 0.12] }}
            transition={{ duration: 2.5 + (i % 4) * 0.8, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}

        {/* ── Background buildings ── */}
        {bgBuildings.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h}
              fill={i === 1 ? "#090f1e" : "#070d1c"} />
            {/* bg windows */}
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: Math.floor(b.w / 14) }).map((_, col) => {
                const lit = (row + col + i) % 3 === 0;
                return lit ? (
                  <rect
                    key={`${row}-${col}`}
                    x={b.x + 6 + col * 12} y={b.y + 12 + row * 18}
                    width={5} height={7}
                    fill="#EA8D0E" opacity={0.25 + (col % 3) * 0.1}
                  />
                ) : null;
              })
            )}
            {/* BG building rooftop line */}
            <line x1={b.x} y1={b.y} x2={b.x + b.w} y2={b.y}
              stroke="#0BB5BE" strokeWidth={0.5} opacity={0.3} />
          </g>
        ))}

        {/* ── Main tower shadow/depth ── */}
        <rect x="145" y="68" width="120" height="305" rx="1"
          fill="#040810" opacity={0.6} transform="translate(4,4)" />

        {/* ── Podium shadow ── */}
        <rect x="118" y="358" width="172" height="110" rx="1"
          fill="#040810" opacity={0.5} transform="translate(4,4)" />

        {/* ── Podium (wider base) ── */}
        <rect x="118" y="358" width="172" height="112" rx="1" fill="url(#podium)" />

        {/* Podium horizontal lines (floor plates) */}
        {[375, 397, 419, 441, 460].map((y, i) => (
          <line key={i} x1="118" y1={y} x2="290" y2={y}
            stroke="#1a2a46" strokeWidth="0.8" />
        ))}

        {/* Podium corner lines */}
        <line x1="118" y1="358" x2="118" y2="470" stroke="#1e3060" strokeWidth="0.8" opacity={0.6} />
        <line x1="290" y1="358" x2="290" y2="470" stroke="#1e3060" strokeWidth="0.8" opacity={0.6} />

        {/* ── Main tower body ── */}
        <rect x="145" y="68" width="120" height="295" rx="1" fill="url(#tower)" />

        {/* Tower floor plates */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1="145" y1={78 + i * 22} x2="265" y2={78 + i * 22}
            stroke="#162040" strokeWidth="0.6" />
        ))}

        {/* Tower vertical structural lines */}
        <line x1="145" y1="68" x2="145" y2="363" stroke="#1e3060" strokeWidth="0.8" opacity={0.6} />
        <line x1="265" y1="68" x2="265" y2="363" stroke="#1e3060" strokeWidth="0.8" opacity={0.6} />
        <line x1="205" y1="68" x2="205" y2="363" stroke="#162040" strokeWidth="0.4" opacity={0.4} />

        {/* ── Teal accent bands ── */}
        <rect x="145" y="355" width="120" height="3" fill="#0BB5BE" opacity={0.7} />
        <rect x="145" y="165" width="120" height="2" fill="#0BB5BE" opacity={0.35} />
        <rect x="145" y="265" width="120" height="1.5" fill="#0BB5BE" opacity={0.25} />

        {/* Podium-tower junction glow */}
        <ellipse cx="204" cy="360" rx="65" ry="6" fill="#0BB5BE" opacity={0.15} />

        {/* ── Rooftop details ── */}
        {/* Helipad ring */}
        <rect x="164" y="52" width="82" height="18" rx="1" fill="#0d1930" />
        <rect x="164" y="52" width="82" height="18" rx="1"
          fill="none" stroke="#1e3060" strokeWidth="0.8" />
        {/* Main antenna */}
        <line x1="205" y1="8" x2="205" y2="52" stroke="#EA8D0E" strokeWidth="1.2" opacity={0.8} />
        <line x1="200" y1="30" x2="205" y2="22" stroke="#EA8D0E" strokeWidth="0.8" opacity={0.5} />
        <line x1="210" y1="30" x2="205" y2="22" stroke="#EA8D0E" strokeWidth="0.8" opacity={0.5} />
        {/* Antenna tip glow */}
        <motion.circle
          cx="205" cy="8" r="2.5" fill="#EA8D0E"
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        {/* Pulse ring — scale instead of r */}
        <motion.circle
          cx="205" cy="8" r="6" fill="none" stroke="#EA8D0E" strokeWidth="1.5"
          animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
          style={{ transformOrigin: "205px 8px" }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />

        {/* Small side antenna */}
        <line x1="240" y1="28" x2="240" y2="52" stroke="#1e3060" strokeWidth="0.8" />
        <circle cx="240" cy="28" r="1.5" fill="#0BB5BE" opacity={0.7} />

        {/* Roof tech platform */}
        <rect x="176" y="60" width="58" height="8" rx="0.5" fill="#0f1e38" />
        <rect x="180" y="62" width="10" height="4" rx="0.5" fill="#162a4a" />
        <rect x="195" y="62" width="10" height="4" rx="0.5" fill="#162a4a" />
        <rect x="220" y="62" width="10" height="4" rx="0.5" fill="#162a4a" />

        {/* ── Windows ── */}
        {windows.map(([wx, wy, lit], i) => (
          <g key={i}>
            {lit && (
              <rect x={wx - 1} y={wy - 1} width={13} height={13}
                fill="#EA8D0E" opacity={0.12} rx={1} />
            )}
            <rect
              x={wx} y={wy} width={11} height={11} rx={0.5}
              fill={lit ? "url(#winAmber)" : "#0a1428"}
              opacity={lit ? 0.85 : 0.9}
            />
            {lit && (
              <motion.rect
                x={wx} y={wy} width={11} height={11} rx={0.5}
                fill="#EA8D0E" opacity={0}
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{
                  duration: 3 + (i % 7) * 0.5,
                  repeat: Infinity,
                  delay: i * 0.12,
                }}
              />
            )}
          </g>
        ))}

        {/* ── Ground floor lobby ── */}
        <rect x="118" y="466" width="172" height="14" rx="0" fill="#0a1525" />
        {/* Lobby glass panels */}
        {[0,1,2,3,4,5].map(i => (
          <rect key={i} x={124 + i * 28} y={468} width={22} height={10}
            fill="#0BB5BE" opacity={0.08 + (i % 2) * 0.06} />
        ))}
        {/* Lobby door */}
        <rect x="188" y="456" width="28" height="24" rx="0.5"
          fill="#0d1e38" />
        <rect x="188" y="456" width="28" height="24" rx="0.5"
          fill="none" stroke="#0BB5BE" strokeWidth="0.8" opacity={0.4} />
        <line x1="202" y1="456" x2="202" y2="480"
          stroke="#0BB5BE" strokeWidth="0.5" opacity={0.4} />

        {/* ── Ground / street ── */}
        <rect x="0" y="478" width="408" height="62" fill="#060c1a" />
        <line x1="0" y1="478" x2="408" y2="478" stroke="#0BB5BE" strokeWidth="0.6" opacity={0.3} />

        {/* Ground ambient glow */}
        <ellipse cx="204" cy="478" rx="140" ry="20" fill="url(#groundGlow)" />

        {/* Street reflection */}
        <rect x="118" y="480" width="172" height="40" rx="0"
          fill="url(#towerGlow)" opacity={0.4} />

        {/* Street details */}
        <line x1="60" y1="495" x2="175" y2="495" stroke="#1a2a46" strokeWidth="0.5" />
        <line x1="233" y1="495" x2="348" y2="495" stroke="#1a2a46" strokeWidth="0.5" />

        {/* ── Teal corner glow lines on tower ── */}
        <line x1="145" y1="68" x2="145" y2="363"
          stroke="url(#tealGlow)" strokeWidth="2" opacity={0.5} />
        <line x1="265" y1="68" x2="265" y2="363"
          stroke="url(#tealGlow)" strokeWidth="2" opacity={0.5} />

        {/* ── OPAS wordmark on podium ── */}
        <text x="204" y="448" textAnchor="middle"
          fill="#EA8D0E" fontSize="10" opacity={0.45}
          letterSpacing="6"
          fontFamily="BankGothic, sans-serif"
        >
          OPAS
        </text>

      </g>
    </svg>
  );
}
