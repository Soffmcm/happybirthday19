import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface EnvelopeProps {
  letterContent: React.ReactNode;
}

type Stage = "front" | "back" | "open" | "letter";

// White / cream envelope palette
const ENV_BODY = "linear-gradient(160deg, oklch(0.985 0.005 80) 0%, oklch(0.94 0.015 75) 100%)";
const ENV_FLAP = "linear-gradient(180deg, oklch(0.97 0.008 80) 0%, oklch(0.91 0.018 75) 100%)";
const ENV_FLAP_INSIDE =
  "linear-gradient(180deg, oklch(0.88 0.02 70) 0%, oklch(0.82 0.025 65) 100%)";
const ENV_EDGE = "oklch(0.82 0.02 70)";

export function Envelope({ letterContent }: EnvelopeProps) {
  const [stage, setStage] = useState<Stage>("front");

  const handleEnvelopeClick = () => {
    if (stage === "front") {
      setStage("back");
    } else if (stage === "back") {
      setStage("open");
    }
  };

  const handlePaperClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stage === "open") setStage("letter");
  };

  const W = "min(420px, 85vw)";
  const H = "min(280px, 56vw)";

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
            style={{ perspective: "1800px" }}
          >
            <motion.div
              className="envelope-shadow relative"
              style={{
                width: W,
                height: H,
                transformStyle: "preserve-3d",
                cursor: stage === "open" ? "default" : "pointer",
              }}
              animate={{ rotateY: stage === "front" ? 0 : 180 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              onClick={handleEnvelopeClick}
              whileHover={stage === "front" || stage === "back" ? { scale: 1.03, y: -4 } : {}}
            >
              {/* ====== FRONT FACE (address side) ====== */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  background: ENV_BODY,
                  borderRadius: "6px",
                  border: `1px solid ${ENV_EDGE}`,
                  boxShadow:
                    "inset 0 0 30px oklch(0 0 0 / 0.06), inset 0 2px 3px oklch(1 0 0 / 0.5)",
                  opacity: stage === "front" ? 1 : 0,
                  pointerEvents: stage === "front" ? "auto" : "none",
                  transition: "opacity 0.2s ease",
                }}
              >
                {/* Stamp */}
                <div
                  className="absolute right-4 top-4 flex items-center justify-center"
                  style={{
                    width: "62px",
                    height: "76px",
                    background:
                      "linear-gradient(135deg, oklch(0.92 0.08 20) 0%, oklch(0.78 0.16 15) 100%)",
                    border: "2px dashed oklch(0.99 0.01 80)",
                    borderRadius: "3px",
                    boxShadow: "0 2px 6px oklch(0 0 0 / 0.15)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-script)",
                      fontSize: "1.8rem",
                      color: "oklch(0.99 0.01 80)",
                      lineHeight: 1,
                    }}
                  >
                    ♡
                  </div>
                </div>

                {/* Address */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{
                    fontFamily: "var(--font-script)",
                    color: "var(--ink)",
                  }}
                >
                  <div style={{ fontSize: "clamp(1.5rem, 4.5vw, 2.4rem)", lineHeight: 1.1 }}>
                    To my love
                  </div>
                  <div
                    className="mx-auto mt-2"
                    style={{
                      width: "60%",
                      height: "1px",
                      background: "oklch(0.4 0.05 30 / 0.3)",
                    }}
                  />
                  <div
                    className="mt-2 text-[10px] tracking-[0.4em] uppercase"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--rose)",
                      opacity: 0.85,
                    }}
                  >
                    open me ♡
                  </div>
                </div>
              </div>

              {/* ====== BACK FACE (flap side) ====== */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: ENV_BODY,
                  borderRadius: "6px",
                  border: `1px solid ${ENV_EDGE}`,
                  boxShadow: "inset 0 0 30px oklch(0 0 0 / 0.06)",
                  opacity: stage === "front" ? 0 : 1,
                  pointerEvents: stage === "front" ? "none" : "auto",
                  transition: "opacity 0.2s ease",
                }}
              >
                {/* Horizontal seam where flap meets body */}
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: "55%",
                    height: "1px",
                    background: "oklch(0.6 0.03 60 / 0.25)",
                  }}
                />

                {/* Paper sliding out — only visible AFTER flap opens */}
                <AnimatePresence>
                  {stage === "open" && (
                    <motion.div
                      key="paper"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: -50, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                      className="paper-texture absolute left-1/2 top-1/2 cursor-pointer"
                      style={{
                        width: "85%",
                        height: "75%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "3px",
                        zIndex: 1,
                      }}
                      onClick={handlePaperClick}
                      whileHover={{ y: -65, scale: 1.02 }}
                    >
                      <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
                        <div
                          style={{
                            fontFamily: "var(--font-script)",
                            fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)",
                            color: "var(--ink)",
                            lineHeight: 1.2,
                          }}
                        >
                          For my love ♡
                        </div>
                        <div
                          className="mt-2 text-[10px] tracking-[0.3em] uppercase"
                          style={{ color: "var(--ink)", opacity: 0.5 }}
                        >
                          click to read
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* TOP TRIANGULAR FLAP (the part that opens) */}
                <motion.div
                  className="absolute left-0 right-0 top-0"
                  style={{
                    height: "55%",
                    transformOrigin: "top",
                    zIndex: 3,
                  }}
                  animate={{ rotateX: stage === "open" ? -175 : 0 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                >
                  {/* Outside of flap (visible when closed) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: ENV_FLAP,
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      backfaceVisibility: "hidden",
                      filter: "drop-shadow(0 3px 6px oklch(0 0 0 / 0.18))",
                      borderTop: `1px solid ${ENV_EDGE}`,
                    }}
                  />
                  {/* Inside of flap (visible when opened) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: ENV_FLAP_INSIDE,
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      transform: "rotateX(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  />
                </motion.div>

                {/* Wax seal — disappears when flap opens */}
                <AnimatePresence>
                  {stage === "back" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        top: "55%",
                        zIndex: 4,
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle at 35% 30%, oklch(0.7 0.22 18), oklch(0.45 0.2 15))",
                        boxShadow:
                          "0 4px 12px oklch(0 0 0 / 0.4), inset -3px -4px 8px oklch(0 0 0 / 0.35), inset 2px 2px 5px oklch(1 0 0 / 0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-script)",
                        fontSize: "1.6rem",
                        color: "oklch(0.96 0.03 60)",
                        textShadow: "0 1px 2px oklch(0 0 0 / 0.4)",
                      }}
                    >
                      ♡
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hint to click and open */}
                <AnimatePresence>
                  {stage === "back" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                      className="click-hint absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--rose)",
                        zIndex: 5,
                      }}
                    >
                      tap to open ♡
                    </motion.div>
                  )}
                </AnimatePresence>
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
