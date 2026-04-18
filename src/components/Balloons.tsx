import { useMemo } from "react";

const BALLOON_COLORS = [
  "var(--rose)",
  "var(--blush)",
  "var(--gold)",
  "var(--primary)",
  "var(--accent)",
  "#e8a4b8",
  "#f4c2a8",
];

interface BalloonProps {
  count?: number;
}

export function Balloons({ count = 18 }: BalloonProps) {
  const balloons = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 40 + Math.random() * 40,
        duration: 9 + Math.random() * 8,
        delay: Math.random() * 10,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="animate-balloon absolute"
          style={{
            left: `${b.left}%`,
            bottom: 0,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <div
            style={{
              width: `${b.size}px`,
              height: `${b.size * 1.2}px`,
              background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, ${b.color} 70%, white), ${b.color})`,
              borderRadius: "50% 50% 50% 50% / 55% 55% 45% 45%",
              boxShadow: `inset -6px -10px 20px oklch(0 0 0 / 0.15), 0 10px 25px oklch(0.4 0.1 20 / 0.2)`,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `8px solid ${b.color}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: `${b.size * 1.2}px`,
                left: "50%",
                width: "1px",
                height: `${b.size * 1.5}px`,
                background: "oklch(0.5 0.05 30 / 0.4)",
                transformOrigin: "top",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Confetti({ count = 30 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="animate-confetti absolute"
          style={{
            left: `${p.left}%`,
            top: 0,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            borderRadius: "2px",
          }}
        />
      ))}
    </div>
  );
}
