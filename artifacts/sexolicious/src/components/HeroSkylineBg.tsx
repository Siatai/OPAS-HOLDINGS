import React from "react";

/**
 * HeroSkylineBg
 * ---------------------------------------------------------------
 * Cinematic neon-data hero backdrop. A stylised global skyline
 * (Burj Khalifa, Empire State, Eiffel, Big Ben, Chrysler, Tokyo
 * Tower, Marina Bay Sands, Statue of Liberty + filler skyscrapers)
 * sits at the bottom of the hero. A teal "data uplink" network
 * traces between every iconic peak, and amber data packets stream
 * along both the network and a ground-level transmission line.
 *
 * Pure SVG + SMIL animation — no JS frame loop, no bundle cost.
 * ---------------------------------------------------------------
 */
export default function HeroSkylineBg() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] z-0 select-none">
      {/* Bottom gradient mask so skyline fades into the dark hero */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(8,12,24,0.4) 55%, rgba(8,12,24,0.85) 100%)",
        }}
      />

      <svg
        viewBox="0 0 1600 500"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <defs>
          {/* Neon glow filters */}
          <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b1" />
            <feGaussianBlur stdDeviation="6" result="b2" in="SourceGraphic" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-teal" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="t1" />
            <feMerge>
              <feMergeNode in="t1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient for the ground transmission line */}
          <linearGradient id="ground-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(234,141,14,0)" />
            <stop offset="30%" stopColor="rgba(234,141,14,0.55)" />
            <stop offset="70%" stopColor="rgba(11,181,190,0.5)" />
            <stop offset="100%" stopColor="rgba(11,181,190,0)" />
          </linearGradient>

          {/* Soft star/twinkle dot */}
          <radialGradient id="star-grad">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* === Reusable skyline paths (peaks anchor the network) === */}

          {/* 1. Burj Khalifa (Dubai) — peak ~ (110, 30) */}
          <path
            id="b-burj"
            d="M 88 500 L 88 230 L 95 215 L 102 190 L 108 130 L 110 70 L 110 30 L 112 70 L 114 130 L 120 190 L 127 215 L 134 230 L 134 500 Z"
          />

          {/* 2. Empire State Building — peak ~ (262, 120) */}
          <path
            id="b-empire"
            d="M 220 500 L 220 290 L 232 290 L 232 250 L 248 250 L 248 200 L 276 200 L 276 250 L 292 250 L 292 290 L 304 290 L 304 500 Z M 262 200 L 262 120"
          />

          {/* 3. Chrysler Building — peak ~ (412, 95) */}
          <path
            id="b-chrysler"
            d="M 388 500 L 388 280 L 398 280 L 398 250 L 408 240 L 408 220 L 410 200 L 412 180 L 414 200 L 416 220 L 416 240 L 426 250 L 426 280 L 436 280 L 436 500 Z M 412 180 L 412 95"
          />

          {/* 4. Eiffel Tower (Paris) — peak ~ (560, 50) */}
          <path
            id="b-eiffel"
            d="M 510 500 L 540 500 L 552 350 L 548 300 L 545 220 L 555 130 L 560 80 L 565 130 L 575 220 L 572 300 L 568 350 L 580 500 L 610 500 M 530 410 L 590 410 M 542 340 L 578 340 M 548 240 L 572 240"
          />

          {/* 5. Big Ben (London) — peak ~ (705, 110) */}
          <path
            id="b-bigben"
            d="M 680 500 L 680 280 L 676 280 L 676 270 L 734 270 L 734 280 L 730 280 L 730 500 Z M 688 270 L 688 230 L 722 230 L 722 270 M 696 230 L 696 195 L 714 195 L 714 230 M 700 195 L 700 165 L 710 165 L 710 195 M 705 165 L 705 110"
          />

          {/* 6. Tokyo Tower — peak ~ (825, 95) */}
          <path
            id="b-tokyo"
            d="M 778 500 L 825 220 L 872 500 M 798 380 L 852 380 M 808 320 L 842 320 M 815 260 L 835 260 M 825 220 L 825 95"
          />

          {/* 7. Filler skyscrapers (Hong Kong / Singapore / NYC mood) */}
          <path
            id="b-fill1"
            d="M 920 500 L 920 320 L 980 320 L 980 500 Z M 928 340 L 928 470 M 942 340 L 942 470 M 958 340 L 958 470 M 972 340 L 972 470"
          />
          <path
            id="b-fill2"
            d="M 990 500 L 990 380 L 1040 380 L 1040 500 Z M 998 395 L 998 480 M 1012 395 L 1012 480 M 1026 395 L 1026 480"
          />

          {/* 8. Marina Bay Sands (Singapore) — sky-park top ~ (1140, 215) */}
          <path
            id="b-mbs"
            d="M 1060 500 L 1060 290 L 1090 290 L 1090 500 Z
               M 1110 500 L 1110 270 L 1140 270 L 1140 500 Z
               M 1160 500 L 1160 290 L 1190 290 L 1190 500 Z
               M 1050 265 L 1200 215 L 1200 245 L 1050 290 Z"
          />

          {/* 9. Petronas-ish twin towers (KL/HK mood) — peaks (1255, 130) (1305, 130) */}
          <path
            id="b-twin"
            d="M 1235 500 L 1235 280 L 1245 270 L 1245 220 L 1252 200 L 1255 130 L 1258 200 L 1265 220 L 1265 270 L 1275 280 L 1275 500 Z
               M 1285 500 L 1285 280 L 1295 270 L 1295 220 L 1302 200 L 1305 130 L 1308 200 L 1315 220 L 1315 270 L 1325 280 L 1325 500 Z
               M 1280 245 L 1280 235 L 1285 230 L 1295 230 L 1295 245 Z"
          />

          {/* 10. Statue of Liberty (NYC) — torch peak ~ (1430, 105) */}
          <path
            id="b-liberty"
            d="M 1400 500 L 1400 450 L 1380 450 L 1380 400 L 1460 400 L 1460 450 L 1440 450 L 1440 500 Z
               M 1410 400 L 1410 350 L 1430 320 L 1428 280 L 1426 240 L 1424 200 L 1420 160 L 1425 130 L 1430 105 L 1437 140 L 1442 170"
          />

          {/* 11. Shanghai Tower curl — peak ~ (1525, 75) */}
          <path
            id="b-shanghai"
            d="M 1490 500 L 1490 280 L 1495 240 L 1505 180 L 1518 120 L 1525 75 L 1530 120 L 1538 180 L 1545 240 L 1548 280 L 1548 500 Z"
          />

          {/* === Data uplink network path (connects every peak) === */}
          <path
            id="net-path"
            d="M 0 360
               L 110 30
               L 262 120
               L 412 95
               L 560 50
               L 705 110
               L 825 95
               L 950 250
               L 1015 320
               L 1140 215
               L 1255 130
               L 1305 130
               L 1430 105
               L 1525 75
               L 1600 280"
            fill="none"
          />

          {/* Ground-level transmission line */}
          <path
            id="ground-line"
            d="M 0 478 L 1600 478"
            fill="none"
          />
        </defs>

        {/* ── Background twinkle stars ────────────────────────────── */}
        <g opacity="0.55">
          {[
            [120, 80], [240, 50], [370, 70], [480, 40], [600, 90],
            [770, 60], [890, 45], [1050, 80], [1180, 55], [1320, 70],
            [1420, 40], [1490, 100], [180, 130], [340, 160], [620, 165],
            [840, 175], [1100, 150], [1250, 180], [1380, 200], [1540, 160],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.4" fill="url(#star-grad)">
              <animate
                attributeName="opacity"
                values="0.2;1;0.2"
                dur={`${2.5 + (i % 5) * 0.7}s`}
                begin={`${(i % 7) * 0.4}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* ── Skyline (filled silhouette + neon outline) ──────────── */}
        <g>
          {/* Soft filled silhouette behind */}
          {[
            "b-burj", "b-empire", "b-chrysler", "b-eiffel", "b-bigben",
            "b-tokyo", "b-fill1", "b-fill2", "b-mbs", "b-twin",
            "b-liberty", "b-shanghai",
          ].map((id) => (
            <use
              key={`fill-${id}`}
              href={`#${id}`}
              fill="rgba(8, 14, 28, 0.92)"
              stroke="none"
            />
          ))}

          {/* Neon amber outline + animated draw-on */}
          {[
            "b-burj", "b-empire", "b-chrysler", "b-eiffel", "b-bigben",
            "b-tokyo", "b-fill1", "b-fill2", "b-mbs", "b-twin",
            "b-liberty", "b-shanghai",
          ].map((id, i) => (
            <use
              key={`stroke-${id}`}
              href={`#${id}`}
              fill="none"
              stroke="#EA8D0E"
              strokeWidth="1.2"
              strokeOpacity="0.85"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-amber)"
              style={{
                strokeDasharray: 2400,
                strokeDashoffset: 2400,
                animation: `opasDraw 8s ease-out ${i * 0.18}s forwards`,
              }}
            />
          ))}
        </g>

        {/* ── Data uplink network (teal) ──────────────────────────── */}
        <use
          href="#net-path"
          stroke="#0BB5BE"
          strokeWidth="0.6"
          strokeOpacity="0.5"
          strokeDasharray="2 4"
          fill="none"
          filter="url(#glow-teal)"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-120"
            dur="6s"
            repeatCount="indefinite"
          />
        </use>

        {/* Pulsing rings on every iconic peak */}
        {[
          [110, 30], [262, 120], [412, 95], [560, 50], [705, 110],
          [825, 95], [1140, 215], [1255, 130], [1305, 130],
          [1430, 105], [1525, 75],
        ].map(([cx, cy], i) => (
          <g key={`peak-${i}`}>
            <circle cx={cx} cy={cy} r="2" fill="#EA8D0E" filter="url(#glow-amber)">
              <animate
                attributeName="opacity"
                values="1;0.4;1"
                dur="2.2s"
                begin={`${(i * 0.25) % 2}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={cx}
              cy={cy}
              r="2"
              fill="none"
              stroke="#EA8D0E"
              strokeOpacity="0.6"
            >
              <animate
                attributeName="r"
                from="2"
                to="14"
                dur="2.6s"
                begin={`${(i * 0.35) % 3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                from="0.7"
                to="0"
                dur="2.6s"
                begin={`${(i * 0.35) % 3}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* ── Data packets flowing along the network (teal) ───────── */}
        {[0, 1.5, 3, 4.5, 6, 7.5].map((delay, i) => (
          <circle key={`netpkt-${i}`} r={i % 2 === 0 ? 2.4 : 1.8} fill="#7fdce2" filter="url(#glow-teal)">
            <animateMotion dur="9s" begin={`${delay}s`} repeatCount="indefinite" rotate="auto">
              <mpath href="#net-path" />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.05;0.92;1"
              dur="9s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* ── Vertical uplink beams from select peaks ─────────────── */}
        {[
          [110, 30], [560, 50], [1140, 215], [1430, 105], [1525, 75],
        ].map(([cx, cy], i) => (
          <line
            key={`beam-${i}`}
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - 80}
            stroke="#EA8D0E"
            strokeWidth="0.5"
            strokeOpacity="0.35"
            filter="url(#glow-amber)"
          >
            <animate
              attributeName="stroke-opacity"
              values="0;0.6;0"
              dur="3s"
              begin={`${i * 0.6}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}

        {/* ── Ground transmission line + amber packets ────────────── */}
        <use
          href="#ground-line"
          stroke="url(#ground-grad)"
          strokeWidth="1"
          fill="none"
        />
        {[0, 1.2, 2.4, 3.6, 4.8, 6].map((delay, i) => (
          <circle key={`gp-${i}`} r="2" fill="#EA8D0E" filter="url(#glow-amber)">
            <animateMotion dur="7s" begin={`${delay}s`} repeatCount="indefinite">
              <mpath href="#ground-line" />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.05;0.92;1"
              dur="7s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* ── HUD waypoint labels above the iconic peaks ──────────── */}
        <g
          fontFamily="Nevera, Inter, sans-serif"
          fontSize="6"
          letterSpacing="2"
          fill="rgba(234,141,14,0.55)"
          textAnchor="middle"
        >
          <text x="110" y="20">DXB · 01</text>
          <text x="262" y="110">NYC · 02</text>
          <text x="560" y="40">PAR · 03</text>
          <text x="705" y="100">LDN · 04</text>
          <text x="825" y="85">TKY · 05</text>
          <text x="1140" y="205">SGP · 06</text>
          <text x="1305" y="120">HKG · 07</text>
          <text x="1525" y="65">SHA · 08</text>
        </g>
      </svg>

      <style>{`
        @keyframes opasDraw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
