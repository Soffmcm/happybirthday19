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
      className="relative flex h-full w-full flex-col items-center justify-center px-6"
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => {
        if (e.touches[0]) handleMove(e.touches[0].clientX);
      }}
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
    </div>
  );
}

function CakeSVG({ progress, blownOut }: { progress: number; blownOut: boolean }) {
  // Flame intensity decreases as progress increases
  const intensity = Math.max(0, 1 - progress / 100);
  const flicker = 0.85 + Math.random() * 0.3;

  return (
    <div className="relative">
      <svg
        width="320"
        height="280"
        viewBox="0 0 320 280"
        style={{ maxWidth: "80vw", height: "auto" }}
      >
        {/* Plate */}
        <ellipse cx="160" cy="260" rx="140" ry="10" fill="oklch(0.85 0.02 25 / 0.5)" />

        {/* Bottom tier */}
        <rect x="40" y="180" width="240" height="70" rx="6" fill="oklch(0.95 0.04 30)" />
        <rect x="40" y="180" width="240" height="10" fill="oklch(0.88 0.08 25)" />
        {/* Drips */}
        {[60, 100, 140, 180, 220, 260].map((x, i) => (
          <path
            key={i}
            d={`M ${x} 190 Q ${x + 4} ${200 + (i % 2) * 6} ${x + 8} 195`}
            fill="oklch(0.88 0.08 25)"
          />
        ))}

        {/* Top tier */}
        <rect x="90" y="120" width="140" height="65" rx="6" fill="oklch(0.97 0.03 30)" />
        <rect x="90" y="120" width="140" height="8" fill="oklch(0.88 0.08 25)" />
        {[110, 140, 170, 200].map((x, i) => (
          <path
            key={i}
            d={`M ${x} 128 Q ${x + 3} ${136 + (i % 2) * 4} ${x + 6} 132`}
            fill="oklch(0.88 0.08 25)"
          />
        ))}

        {/* Decorations - small dots */}
        {[60, 90, 120, 150, 180, 210, 240, 270].map((x) => (
          <circle key={`d1-${x}`} cx={x} cy="220" r="3" fill="oklch(0.88 0.08 25)" />
        ))}
        {[110, 140, 170, 200].map((x) => (
          <circle key={`d2-${x}`} cx={x} cy="160" r="2.5" fill="oklch(0.88 0.08 25)" />
        ))}

        {/* Candle "1" */}
        <Candle x={130} flameIntensity={intensity} flicker={flicker} blownOut={blownOut} digit="1" />
        {/* Candle "9" */}
        <Candle x={180} flameIntensity={intensity} flicker={flicker} blownOut={blownOut} digit="9" />
      </svg>

      {/* Smoke when blown out */}
      {blownOut && (
        <>
          <motion.div
            className="absolute"
            style={{
              left: "calc(50% - 20px)",
              top: "20px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "oklch(0.7 0.01 0 / 0.4)",
            }}
            initial={{ y: 0, opacity: 0.6, scale: 1 }}
            animate={{ y: -80, opacity: 0, scale: 2.5 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute"
            style={{
              left: "calc(50% + 12px)",
              top: "20px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "oklch(0.7 0.01 0 / 0.4)",
            }}
            initial={{ y: 0, opacity: 0.6, scale: 1 }}
            animate={{ y: -80, opacity: 0, scale: 2.5 }}
            transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
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
