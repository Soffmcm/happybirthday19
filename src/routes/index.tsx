import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Balloons, Confetti } from "@/components/Balloons";
import { Envelope } from "@/components/Envelope";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday My Love ♡" },
      {
        name: "description",
        content: "A little something I made just for you on your 19th birthday.",
      },
      { property: "og:title", content: "Happy Birthday My Love ♡" },
      {
        property: "og:description",
        content: "A little something I made just for you on your 19th birthday.",
      },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Dancing+Script:wght@500;700&display=swap",
      },
    ],
  }),
  component: Index,
});

type Scene = "greeting" | "tease" | "envelope";

function Index() {
  const [scene, setScene] = useState<Scene>("greeting");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const advance = () => {
    if (scene === "greeting") setScene("tease");
    else if (scene === "tease") setScene("envelope");
  };

  return (
    <main
      className="relative h-screen w-screen overflow-hidden"
      style={{ background: "var(--gradient-sunset)" }}
      onClick={scene !== "envelope" ? advance : undefined}
      role={scene !== "envelope" ? "button" : undefined}
      tabIndex={scene !== "envelope" ? 0 : -1}
      onKeyDown={(e) => {
        if (scene !== "envelope" && (e.key === "Enter" || e.key === " ")) advance();
      }}
    >
      <Balloons count={20} />
      {showConfetti && scene === "greeting" && <Confetti count={40} />}

      <AnimatePresence mode="wait">
        {scene === "greeting" && (
          <motion.section
            key="greeting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex h-full w-full cursor-pointer items-center justify-center px-6"
          >
            <div className="text-center">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-4 text-2xl tracking-[0.4em] uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--rose)",
                }}
              >
                ♡ Happy 19th ♡
              </motion.div>

              <motion.h1
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="animate-shimmer leading-[0.95]"
                style={{
                  fontFamily: "var(--font-script)",
                  fontSize: "clamp(3.5rem, 12vw, 9rem)",
                  color: "var(--primary)",
                  fontWeight: 700,
                }}
              >
                Happy Birthday
                <br />
                my lovee
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="click-hint mt-10 text-sm tracking-[0.3em] uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--rose)",
                  opacity: 0.7,
                }}
              >
                tap anywhere to continue ♡
              </motion.div>
            </div>
          </motion.section>
        )}

        {scene === "tease" && (
          <motion.section
            key="tease"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex h-full w-full cursor-pointer items-center justify-center px-6"
          >
            <div className="text-center">
              <motion.h2
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 8vw, 6rem)",
                  fontStyle: "italic",
                  color: "var(--ink)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                }}
              >
                I made you
                <br />
                something
                <span style={{ color: "var(--rose)" }}>...</span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="click-hint mt-12 text-sm tracking-[0.3em] uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--rose)",
                  opacity: 0.7,
                }}
              >
                tap to see ♡
              </motion.div>
            </div>
          </motion.section>
        )}

        {scene === "envelope" && (
          <motion.section
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 h-full w-full"
          >
            <Envelope letterContent={<LetterContent />} />
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function LetterContent() {
  return (
    <article className="space-y-5">
      <header className="text-center">
        <div
          style={{
            fontFamily: "var(--font-script)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--rose)",
            lineHeight: 1.1,
          }}
        >
          My dearest love,
        </div>
        <div
          className="mt-2 text-xs tracking-[0.3em] uppercase"
          style={{ opacity: 0.5 }}
        >
          on your 19th birthday
        </div>
      </header>

      <div
        style={{
          fontFamily: "var(--font-letter)",
          fontSize: "clamp(1.05rem, 2.2vw, 1.2rem)",
          lineHeight: 1.75,
        }}
        className="space-y-4"
      >
        <p>
          Today the world gets to celebrate the same person I get to celebrate every single day —
          and somehow that feels both unfair and exactly right.
        </p>
        <p>
          Nineteen years ago, the universe quietly did the kindest thing it has ever done for me. It
          made you. And every laugh, every silly conversation, every quiet moment we share is proof
          that some things really are meant to be.
        </p>
        <p>
          You make ordinary days feel like something worth remembering. You make me braver, softer,
          and more myself all at once. There is nowhere I'd rather be than wherever you are.
        </p>
        <p>
          So happy birthday, my love. Here's to nineteen, to us, and to every adventure still
          waiting for us.
        </p>
        <p
          style={{
            fontFamily: "var(--font-script)",
            fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
            color: "var(--rose)",
            textAlign: "right",
            marginTop: "1.5rem",
          }}
        >
          Forever yours ♡
        </p>
      </div>

      <div className="pt-4 text-center text-xs tracking-[0.3em] uppercase" style={{ opacity: 0.4 }}>
        — placeholder, real letter coming soon —
      </div>
    </article>
  );
}
