import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Balloons, Confetti } from "@/components/Balloons";
import { Envelope } from "@/components/Envelope";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday Babyyy ♡" },
      {
        name: "description",
        content: "Eventhough I can't be there to give you a birthday gift, I still wanted to make you something.",
      },
      { property: "og:title", content: "Happy Birthday My Love ♡" },
      {
        property: "og:description",
        content: "Eventhough I can't be there to give you a birthday gift, I still wanted to make you something.",
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
                (tap anywhere to continue ♡)
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
                something...
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
                (tap to see ♡)
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
          Happy 19th Birthday my lovee,
        </div>
        <div
          className="mt-2 text-xs tracking-[0.3em] uppercase"
          style={{ opacity: 0.5 }}
        >
          I hope it's a really good one
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
          I know you don't really like your birthday or celebrating it and I’m sorry 
          I can't be there with you right now to show you how much you deserve to be celebrated in a day as special as you
          (and you're really special to me). But don't worry, there's nothing I want more than to be there with you next year 
          and to show you how much better this day can be and to hopefully give you one of the best birthdays ever 
          (I also hope you know I'll be trying to one-up myself each year). 
        </p>
        <p>
          But overall, I hope you have an amazing day because you really do deserve it and even though I’m not there I hope 
          I can play even the smallest role in make this day a little bit more special. 
        </p>
        <p>
          I love you sososososooooooooo much and no matter how many times I say it, it still feels like I don’t say it enough.
          But I need you to know that I love you more than I thought was even possible, more than words could ever express, 
          and that my love for you only grows more and more each day. I am so lucky to be able
          to say that someone so kind, beautiful, thoughtful, smart, funny, amazing…. (and so much more)
          is MY GIRLFRIEND HEHEHEHEHEHE
        </p>
        <p>
          ...and honestly the only thing that can top that will be when I get to call you my wife instead. 
          Because I will marry you. And that’s final. 
        </p>
        <p>
          But what I’m trying to say is that you are perfect. And I don’t mean it in a ‘lacking imperfections’ 
          way because “nobody’s prefect” or whatever, I mean it in a ‘You’re perfect for me’ type of way. 
          Because no matter how many ‘flaws’ you think you have in my eyes they couldn’t be further from that, 
          and I truly think that you are my person, and the only person I want to spend the rest of my life with. 
        </p>
        <p>
          When I’m with you I feel seen, and not just in the physical way or the acknowledged way, but 
          I feel like you see me at a much deeper level, one that words couldn’t describe. 
          You make me feel so safe and always push me to be the best version of myself possible 
          (even making me eat vegetables and like drink water. Which is insane btw…)  and you mean so much to me that 
          I’d be completely lost without you. 
        </p>
        <p>
          Whenever I think about my future, its impossible to leave you out the picture,
          all I want in life is to build a life by your side, and to be there to witness
          the many more birthdays you have to come, and to make each and every one of them feel different and 
          special, and to make you see how much you deserve not only to be noticed and celebrated, 
          but appreciated, valued, cared for and so much more. I want to be able to give you the world someday, 
          but even then, it wouldn’t be enough to represent how much you mean to me and all that you deserve to 
          have and accomplish in life.
        </p>
        <p>
          Okay okay I’ll stop being so cheesy and corny now lmfao, happy 19th birthday baby,
          I love you so much, and I hope you have a day as amazing as you are in my eyes.❤️
        </p>
        <p>
          - Sofia❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️
        </p>
        <p>
          (P.S. I’m really glad your parents forgot to use protection 19 years and 9 months ago)
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
