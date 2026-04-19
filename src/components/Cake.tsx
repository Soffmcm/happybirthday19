import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CakeProps {
  onBlownOut: () => void;
}

export function Cake({ onBlownOut }: CakeProps) {
  const [progress, setProgress] = useState(0); // 0 -> 100
  const [blownOut, setBlownOut] = useState(false);
  const lastX = useRef<number | null>(null);
  const lastDir = useRef<0 | 1 | -1>(0);
  const lastMoveTs = useRef<number>(0);
  const decayRef = useRef<number | null>(null);

  // Decay progress slowly if user stops moving
  useEffect(() => {
    decayRef.current = window.setInterval(() => {
      const idle = Date.now() - lastMoveTs.current;
      if (idle > 300 && !blownOut) {
        setProgress((p) => Math.max(0, p - 1.5));
      }
    }, 100) as unknown as number;
    return () => {
      if (decayRef.current) window.clearInterval(decayRef.current);
    };
  }, [blownOut]);

  useEffect(() => {
    if (progress >= 100 && !blownOut) {
      setBlownOut(true);
      const t = setTimeout(() => onBlownOut(), 3000);
      return () => clearTimeout(t);
    }
  }, [progress, blownOut, onBlownOut]);

  const handleMove = (clientX: number) => {
    if (blownOut) return;
    lastMoveTs.current = Date.now();
    if (lastX.current === null) {
      lastX.current = clientX;
      return;
    }
    const dx = clientX - lastX.current;
    lastX.current = clientX;
    if (Math.abs(dx) < 2) return;
    const dir: 1 | -1 = dx > 0 ? 1 : -1;
    // Reward direction changes (left-right-left swipes)
    const gain = dir !== lastDir.current && lastDir.current !== 0
      ? Math.min(14, Math.abs(dx) * 0.5 + 4)
      : Math.min(4, Math.abs(dx) * 0.08);
    lastDir.current = dir;
    setProgress((p) => Math.min(100, p + gain));
  };

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center px-6 ${blownOut ? "cursor-pointer" : ""}`}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => {
        if (e.touches[0]) handleMove(e.touches[0].clientX);
      }}
      onClick={() => {
        if (blownOut) onBlownOut();
      }}
      role={blownOut ? "button" : undefined}
      tabIndex={blownOut ? 0 : -1}
    >
      <AnimatePresence mode="wait">
        {!blownOut ? (
          <motion.div
            key="title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10 text-center"
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.6rem, 4.5vw, 3rem)",
                fontStyle: "italic",
                color: "var(--ink)",
                fontWeight: 400,
                lineHeight: 1.15,
              }}
            >
              But first, blow out the candles!
            </h2>
            <p
              className="mt-3 text-xs tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--rose)",
                opacity: 0.75,
              }}
            >
              (swipe your cursor left & right ♡)
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="hbd"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 text-center"
          >
            <h2
              className="animate-shimmer"
              style={{
                fontFamily: "var(--font-script)",
                fontSize: "clamp(3rem, 10vw, 7rem)",
                color: "var(--primary)",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              HAPPY BIRTHDAY
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <CakeSVG progress={progress} blownOut={blownOut} />

      {!blownOut && (
        <div className="mt-8 w-full max-w-xs">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: "oklch(0.92 0.02 25 / 0.6)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--rose)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
        </div>
      )}

      {blownOut && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="click-hint mt-8 text-xs tracking-[0.3em] uppercase"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--rose)",
            opacity: 0.75,
          }}
        >
          (tap anywhere to continue ♡)
        </motion.p>
      )}
    </div>
  );
}

function CakeSVG({ progress, blownOut }: { progress: number; blownOut: boolean }) {
  // Flame intensity decreases as progress increases
  const intensity = Math.max(0, 1 - progress / 100);
  const flicker = 0.85 + Math.random() * 0.3;

  // Color tokens
  const sponge = "oklch(0.93 0.06 75)"; // warm cream/vanilla
  const spongeShade = "oklch(0.86 0.07 70)";
  const frosting = "oklch(0.86 0.11 15)"; // pastel pink
  const frostingShade = "oklch(0.78 0.13 15)";
  const frostingHi = "oklch(0.93 0.07 15)";
  const dotDark = "oklch(0.45 0.12 25)";
  const dotOrange = "oklch(0.78 0.15 55)";

  return (
    <div className="relative">
      <svg
        width="440"
        height="380"
        viewBox="0 0 440 380"
        style={{ maxWidth: "92vw", height: "auto" }}
      >
        {/* Soft shadow under cake */}
        <ellipse cx="220" cy="358" rx="180" ry="10" fill="oklch(0.55 0.05 25 / 0.18)" />
        {/* Plate */}
        <ellipse cx="220" cy="352" rx="190" ry="12" fill={frosting} opacity="0.55" />
        <ellipse cx="220" cy="350" rx="180" ry="9" fill={frostingHi} opacity="0.7" />

        {/* ========== BOTTOM TIER ========== */}
        {/* Sponge body (rounded sides) */}
        <path
          d="M 50 230
             Q 50 218 64 215
             L 376 215
             Q 390 218 390 230
             L 390 332
             Q 390 348 220 348
             Q 50 348 50 332 Z"
          fill={sponge}
        />
        {/* Sponge horizontal layer line */}
        <path
          d="M 58 285 Q 220 295 382 285"
          stroke={spongeShade}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        {/* Frosting top dome */}
        <ellipse cx="220" cy="218" rx="170" ry="22" fill={frosting} />
        <ellipse cx="220" cy="213" rx="150" ry="14" fill={frostingHi} opacity="0.7" />
        {/* Drip frosting around bottom tier top */}
        <path
          d="M 52 228
             Q 70 252 90 232
             Q 108 264 128 234
             Q 148 258 168 230
             Q 188 262 208 234
             Q 228 256 248 232
             Q 268 264 288 234
             Q 308 258 328 230
             Q 348 262 368 232
             Q 382 250 388 228
             L 388 218
             L 52 218 Z"
          fill={frosting}
        />
        {/* Drip highlights */}
        <path
          d="M 52 228 Q 70 252 90 232 Q 108 264 128 234 Q 148 258 168 230 Q 188 262 208 234 Q 228 256 248 232 Q 268 264 288 234 Q 308 258 328 230 Q 348 262 368 232 Q 382 250 388 228"
          stroke={frostingShade}
          strokeWidth="1.5"
          fill="none"
          opacity="0.55"
        />
        {/* Sprinkle dots on bottom tier */}
        {[
          [80, 305, dotDark], [110, 320, dotOrange], [140, 300, dotDark],
          [170, 318, dotOrange], [200, 305, dotDark], [230, 322, dotOrange],
          [260, 302, dotDark], [290, 320, dotDark], [320, 305, dotOrange],
          [350, 318, dotDark],
        ].map(([x, y, c], i) => (
          <circle key={`b-${i}`} cx={x as number} cy={y as number} r="2.8" fill={c as string} />
        ))}

        {/* ========== TOP TIER ========== */}
        {/* Sponge body */}
        <path
          d="M 110 130
             Q 110 120 122 117
             L 318 117
             Q 330 120 330 130
             L 330 210
             Q 330 222 220 222
             Q 110 222 110 210 Z"
          fill={sponge}
        />
        {/* Sponge layer line */}
        <path
          d="M 116 175 Q 220 184 324 175"
          stroke={spongeShade}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        {/* Top frosting dome */}
        <ellipse cx="220" cy="120" rx="110" ry="16" fill={frosting} />
        <ellipse cx="220" cy="116" rx="92" ry="10" fill={frostingHi} opacity="0.75" />
        {/* Drip frosting around top tier */}
        <path
          d="M 112 128
             Q 128 148 146 130
             Q 162 156 180 132
             Q 198 152 216 130
             Q 234 154 252 132
             Q 270 156 288 130
             Q 306 150 324 132
             Q 332 144 328 124
             L 112 124 Z"
          fill={frosting}
        />
        <path
          d="M 112 128 Q 128 148 146 130 Q 162 156 180 132 Q 198 152 216 130 Q 234 154 252 132 Q 270 156 288 130 Q 306 150 324 132"
          stroke={frostingShade}
          strokeWidth="1.5"
          fill="none"
          opacity="0.55"
        />
        {/* Sprinkles on top tier */}
        {[
          [135, 195, dotDark], [165, 205, dotOrange], [195, 195, dotDark],
          [225, 207, dotOrange], [255, 195, dotDark], [285, 205, dotOrange],
          [305, 198, dotDark],
        ].map(([x, y, c], i) => (
          <circle key={`t-${i}`} cx={x as number} cy={y as number} r="2.5" fill={c as string} />
        ))}

        {/* ========== CANDLES (kept the same style) ========== */}
        <Candle x={195} flameIntensity={intensity} flicker={flicker} blownOut={blownOut} digit="1" />
        <Candle x={245} flameIntensity={intensity} flicker={flicker} blownOut={blownOut} digit="9" />
      </svg>

      {/* Smoke when blown out */}
      {blownOut && (
        <>
          <motion.div
            className="absolute"
            style={{
              left: "calc(50% - 28px)",
              top: "30px",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "oklch(0.7 0.01 0 / 0.4)",
            }}
            initial={{ y: 0, opacity: 0.6, scale: 1 }}
            animate={{ y: -100, opacity: 0, scale: 3 }}
            transition={{ duration: 2.5, ease: "easeOut", repeat: 1 }}
          />
          <motion.div
            className="absolute"
            style={{
              left: "calc(50% + 18px)",
              top: "30px",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "oklch(0.7 0.01 0 / 0.4)",
            }}
            initial={{ y: 0, opacity: 0.6, scale: 1 }}
            animate={{ y: -100, opacity: 0, scale: 3 }}
            transition={{ duration: 2.5, delay: 0.3, ease: "easeOut", repeat: 1 }}
          />
        </>
      )}
    </div>
  );
}

function Candle({
  x,
  flameIntensity,
  flicker,
  blownOut,
  digit,
}: {
  x: number;
  flameIntensity: number;
  flicker: number;
  blownOut: boolean;
  digit: string;
}) {
  const candleTop = 60;
  const candleBottom = 120;
  const flameY = candleTop - 4;
  const showFlame = !blownOut && flameIntensity > 0.05;

  return (
    <g>
      {/* Candle body with digit */}
      <rect
        x={x - 10}
        y={candleTop}
        width="20"
        height={candleBottom - candleTop}
        rx="3"
        fill="oklch(0.92 0.05 25)"
        stroke="oklch(0.78 0.06 25)"
        strokeWidth="1"
      />
      <text
        x={x}
        y={candleTop + 36}
        textAnchor="middle"
        fontFamily="var(--font-script)"
        fontSize="22"
        fontWeight="700"
        fill="oklch(0.55 0.18 25)"
      >
        {digit}
      </text>

      {/* Wick */}
      <line
        x1={x}
        y1={candleTop}
        x2={x}
        y2={candleTop - 6}
        stroke="oklch(0.3 0.02 0)"
        strokeWidth="1.5"
      />

      {/* Flame */}
      {showFlame && (
        <g style={{ transformOrigin: `${x}px ${flameY}px` }}>
          {/* Outer glow */}
          <ellipse
            cx={x}
            cy={flameY - 4}
            rx={6 * flameIntensity * flicker}
            ry={12 * flameIntensity * flicker}
            fill="oklch(0.88 0.18 70 / 0.5)"
          />
          {/* Main flame */}
          <ellipse
            cx={x}
            cy={flameY - 2}
            rx={4 * flameIntensity * flicker}
            ry={9 * flameIntensity * flicker}
            fill="oklch(0.85 0.2 60)"
          >
            <animate
              attributeName="ry"
              values={`${9 * flameIntensity};${10 * flameIntensity};${8.5 * flameIntensity};${9 * flameIntensity}`}
              dur="0.4s"
              repeatCount="indefinite"
            />
          </ellipse>
          {/* Inner flame */}
          <ellipse
            cx={x}
            cy={flameY}
            rx={2 * flameIntensity}
            ry={5 * flameIntensity}
            fill="oklch(0.95 0.15 80)"
          />
        </g>
      )}
    </g>
  );
}
