import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface EnvelopeProps {
  letterContent: React.ReactNode;
}

type Stage = "front" | "back" | "open" | "letter";

const ENV_BODY = "linear-gradient(135deg, oklch(0.78 0.14 15) 0%, oklch(0.7 0.18 12) 100%)";
const ENV_FLAP = "linear-gradient(160deg, oklch(0.82 0.13 16) 0%, oklch(0.72 0.17 12) 100%)";
const ENV_FLAP_INSIDE = "linear-gradient(180deg, oklch(0.66 0.2 10) 0%, oklch(0.58 0.22 8) 100%)";

export function Envelope({ letterContent }: EnvelopeProps) {
  const [stage, setStage] = useState<Stage>("front");

  const handleEnvelopeClick = () => {
    if (stage === "front") {
      setStage("back");
      setTimeout(() => setStage("open"), 900);
    }
  };

  const handlePaperClick = () => {
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
              }}
              animate={{ rotateY: stage === "front" ? 0 : 180 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              onClick={handleEnvelopeClick}
              whileHover={stage === "front" ? { scale: 1.03, y: -4 } : {}}
            >
              {/* ====== FRONT FACE (sealed envelope, address side) ====== */}
              <div
                className="absolute inset-0 cursor-pointer overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  background: ENV_BODY,
                  borderRadius: "6px",
                  boxShadow:
                    "inset 0 0 40px oklch(0 0 0 / 0.15), inset 0 2px 4px oklch(1 0 0 / 0.25)",
                }}
              >
                {/* Subtle paper grain */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, oklch(1 0 0 / 0.2), transparent 60%)",
                  }}
                />

                {/* Stamp */}
                <div
                  className="absolute right-4 top-4 flex items-center justify-center"
                  style={{
                    width: "62px",
                    height: "76px",
                    background: "oklch(0.96 0.03 60)",
                    border: "2px dashed oklch(0.7 0.18 12 / 0.6)",
                    borderRadius: "3px",
                    boxShadow: "0 2px 6px oklch(0 0 0 / 0.15)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-script)",
                      fontSize: "1.8rem",
                      color: "var(--rose)",
                      lineHeight: 1,
                    }}
                  >
                    ♡
                  </div>
                </div>

                {/* Address lines */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{
                    fontFamily: "var(--font-script)",
                    color: "oklch(0.96 0.03 60)",
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
                      background: "oklch(0.96 0.03 60 / 0.5)",
                    }}
                  />
                  <div
                    className="mt-2 text-[10px] tracking-[0.4em] uppercase"
                    style={{ fontFamily: "var(--font-display)", opacity: 0.85 }}
                  >
                    open me ♡
                  </div>
                </div>
              </div>

              {/* ====== BACK FACE (flap side, with V seams) ====== */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: ENV_BODY,
                  borderRadius: "6px",
                  boxShadow: "inset 0 0 40px oklch(0 0 0 / 0.15)",
                }}
              >
                {/* Bottom triangular flap (folded up, visible on back) */}
                <div
                  className="absolute left-0 right-0 bottom-0"
                  style={{
                    height: "55%",
                    background: ENV_FLAP,
                    clipPath: "polygon(0 100%, 100% 100%, 50% 0)",
                    boxShadow: "0 -2px 6px oklch(0 0 0 / 0.15)",
                  }}
                />
                {/* Left side flap */}
                <div
                  className="absolute left-0 top-0 bottom-0"
                  style={{
                    width: "50%",
                    background: ENV_FLAP,
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                    opacity: 0.92,
                  }}
                />
                {/* Right side flap */}
                <div
                  className="absolute right-0 top-0 bottom-0"
                  style={{
                    width: "50%",
                    background: ENV_FLAP,
                    clipPath: "polygon(100% 0, 100% 100%, 0 50%)",
                    opacity: 0.92,
                  }}
                />

                {/* Paper sliding out (only when open) */}
                <AnimatePresence>
                  {stage === "open" && (
                    <motion.div
                      key="paper"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: -40, opacity: 1 }}
                      transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                      className="paper-texture absolute left-1/2 top-1/2 cursor-pointer"
                      style={{
                        width: "85%",
                        height: "75%",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "3px",
                        zIndex: 1,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePaperClick();
                      }}
                      whileHover={{ y: -55, scale: 1.02 }}
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
                          click to open
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Top flap (the one that opens) */}
                <motion.div
                  className="absolute left-0 right-0 top-0"
                  style={{
                    height: "55%",
                    background: ENV_FLAP,
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    transformOrigin: "top",
                    zIndex: 3,
                    boxShadow: "0 4px 10px oklch(0 0 0 / 0.25)",
                  }}
                  animate={{ rotateX: stage === "open" ? -180 : 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  {/* Inside of the flap (visible when opened) */}
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

                {/* Wax seal (only while flap is closed) */}
                <AnimatePresence>
                  {stage === "back" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
                      style={{
                        zIndex: 4,
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background:
                          "radial-gradient(circle at 35% 30%, oklch(0.65 0.22 18), oklch(0.45 0.2 15))",
                        boxShadow:
                          "0 4px 10px oklch(0 0 0 / 0.4), inset -3px -4px 8px oklch(0 0 0 / 0.3), inset 2px 2px 4px oklch(1 0 0 / 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-script)",
                        fontSize: "1.4rem",
                        color: "oklch(0.96 0.03 60)",
                        textShadow: "0 1px 2px oklch(0 0 0 / 0.4)",
                      }}
                    >
                      ♡
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
