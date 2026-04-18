import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface EnvelopeProps {
  letterContent: React.ReactNode;
}

type Stage = "front" | "back" | "open" | "letter";

export function Envelope({ letterContent }: EnvelopeProps) {
  const [stage, setStage] = useState<Stage>("front");

  const handleEnvelopeClick = () => {
    if (stage === "front") {
      setStage("back");
      setTimeout(() => setStage("open"), 800);
    }
  };

  const handlePaperClick = () => {
    if (stage === "open") setStage("letter");
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {stage !== "letter" ? (
          <motion.div
            key="envelope"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
            style={{ perspective: "1500px" }}
          >
            <motion.div
              className="envelope-shadow relative"
              style={{
                width: "min(420px, 85vw)",
                height: "min(280px, 56vw)",
                transformStyle: "preserve-3d",
              }}
              animate={{ rotateY: stage === "front" ? 0 : 180 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              onClick={handleEnvelopeClick}
              whileHover={stage === "front" ? { scale: 1.03, y: -4 } : {}}
            >
              {/* FRONT */}
              <div
                className="absolute inset-0 cursor-pointer"
                style={{
                  backfaceVisibility: "hidden",
                  background:
                    "linear-gradient(135deg, oklch(0.78 0.14 15) 0%, oklch(0.7 0.18 12) 100%)",
                  borderRadius: "8px",
                  boxShadow: "inset 0 2px 8px oklch(1 0 0 / 0.3)",
                }}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <motion.div
                    className="animate-heart-pulse text-7xl"
                    style={{ filter: "drop-shadow(0 4px 8px oklch(0 0 0 / 0.3))" }}
                  >
                    💌
                  </motion.div>
                </div>
                <div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] uppercase"
                  style={{ color: "oklch(0.95 0.03 60 / 0.85)", fontFamily: "var(--font-display)" }}
                >
                  click me
                </div>
              </div>

              {/* BACK */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background:
                    "linear-gradient(135deg, oklch(0.74 0.16 12) 0%, oklch(0.66 0.2 10) 100%)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* Envelope body */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.74 0.16 12) 0%, oklch(0.66 0.2 10) 100%)",
                  }}
                />

                {/* Paper peeking out */}
                <AnimatePresence>
                  {stage === "open" && (
                    <motion.div
                      key="paper"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: -30, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                      className="paper-texture absolute left-1/2 top-1/2 cursor-pointer"
                      style={{
                        width: "85%",
                        height: "75%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "4px",
                        zIndex: 1,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaperClick();
                      }}
                      whileHover={{ y: -40, scale: 1.02 }}
                    >
                      <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
                        <div
                          className="text-2xl"
                          style={{
                            fontFamily: "var(--font-script)",
                            color: "var(--ink)",
                          }}
                        >
                          For my love ♡
                        </div>
                        <div
                          className="mt-2 text-[10px] tracking-[0.3em] uppercase"
                          style={{ color: "var(--ink)", opacity: 0.5 }}
                        >
                          click to open
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Top flap (opens) */}
                <motion.div
                  className="absolute left-0 right-0 top-0"
                  style={{
                    height: "55%",
                    background:
                      "linear-gradient(180deg, oklch(0.78 0.15 14) 0%, oklch(0.7 0.18 12) 100%)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    transformOrigin: "top",
                    zIndex: 2,
                    boxShadow: "0 4px 12px oklch(0 0 0 / 0.25)",
                  }}
                  animate={{ rotateX: stage === "open" ? -180 : 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />

                {/* Wax seal */}
                {stage === "back" && (
                  <div
                    className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-3xl"
                    style={{ zIndex: 3 }}
                  >
                    ❤️
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ y: 200, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="paper-texture relative overflow-y-auto"
            style={{
              width: "min(560px, 92vw)",
              maxHeight: "85vh",
              padding: "clamp(2rem, 5vw, 3.5rem)",
              borderRadius: "6px",
              fontFamily: "var(--font-letter)",
              color: "var(--ink)",
            }}
          >
            {letterContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
