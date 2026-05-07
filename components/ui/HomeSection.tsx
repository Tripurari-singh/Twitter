"use client";

import { motion, type Variants } from "framer-motion";
import { Circle, Zap, Globe, Shield, TrendingUp, MessageCircle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignInButton } from "@clerk/nextjs";

// ─── Shared helpers ──────────────────────────────────────────────────────────

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

const sectionFadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.15 * i, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

// ─── Features Section ────────────────────────────────────────────────────────

const features = [
  {
    icon: Zap,
    title: "Real-time feed",
    description:
      "Posts surface instantly — no refresh needed. Stay in the moment as conversations unfold.",
    gradient: "from-indigo-500/[0.18]",
    accent: "text-indigo-300",
  },
  {
    icon: Globe,
    title: "Global trends",
    description:
      "Discover what's moving the world right now. Trending topics, curated by region or interest.",
    gradient: "from-rose-500/[0.18]",
    accent: "text-rose-300",
  },
  {
    icon: Shield,
    title: "Safe by design",
    description:
      "Built-in moderation tools and privacy controls. You decide who sees what, always.",
    gradient: "from-violet-500/[0.18]",
    accent: "text-violet-300",
  },
];

function FeaturesSection() {
  return (
    <section className="relative w-full py-32 bg-[#030303] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.2}
          width={420}
          height={100}
          rotate={-10}
          gradient="from-indigo-500/[0.1]"
          className="right-[-8%] top-[10%]"
        />
        <ElegantShape
          delay={0.4}
          width={260}
          height={70}
          rotate={14}
          gradient="from-rose-500/[0.1]"
          className="left-[-4%] bottom-[15%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-5xl">
        <motion.div
          custom={0}
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-20"
        >
         
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i + 1}
              variants={sectionFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 overflow-hidden"
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl bg-gradient-to-br to-transparent opacity-40",
                  f.gradient
                )}
              />
              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.1]">
                  <f.icon className={cn("w-5 h-5", f.accent)} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-light">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Section ────────────────────────────────────────────────────

const steps = [
  { number: "01", title: "Create your profile", body: "Sign up in seconds. Pick a handle, set your vibe, and you're live." },
  { number: "02", title: "Post your first thought", body: "280 characters. A photo. A hot take. Whatever's on your mind right now." },
  { number: "03", title: "Find your people", body: "Follow topics, join threads, and watch your feed become a conversation." },
];

function HowItWorksSection() {
  return (
    <section className="relative w-full py-32 bg-[#030303] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/[0.15] via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 max-w-5xl">
        <motion.div
          custom={0}
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
            <Circle className="h-2 w-2 fill-rose-500/80" />
            <span className="text-sm text-white/60 tracking-wide">Simple to start</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
              Three steps to
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-300 via-white/90 to-indigo-300">
              your first post
            </span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.number}
                custom={i + 1}
                variants={sectionFadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6 w-20 h-20 rounded-full flex items-center justify-center border border-white/[0.1] bg-white/[0.03]">
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/[0.15] to-rose-500/[0.1]"
                  />
                  <span className="relative text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                    {s.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-light max-w-[220px]">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats / Social Proof Section ────────────────────────────────────────────

const stats = [
  { value: "2.4M", label: "Active users", icon: Globe },
  { value: "18M", label: "Posts today", icon: MessageCircle },
  { value: "94M", label: "Reactions sent", icon: Heart },
  { value: "140+", label: "Countries", icon: TrendingUp },
];

function StatsSection() {
  return (
    <section className="relative w-full py-28 bg-[#030303] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.1}
          width={500}
          height={120}
          rotate={6}
          gradient="from-violet-500/[0.1]"
          className="left-[-6%] top-[30%]"
        />
        <ElegantShape
          delay={0.3}
          width={300}
          height={80}
          rotate={-12}
          gradient="from-amber-500/[0.08]"
          className="right-[-4%] top-[20%]"
        />
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="relative w-full py-40 bg-[#030303] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.2}
          width={560}
          height={130}
          rotate={10}
          gradient="from-indigo-500/[0.18]"
          className="left-[-8%] top-[25%]"
        />
        <ElegantShape
          delay={0.4}
          width={420}
          height={100}
          rotate={-14}
          gradient="from-rose-500/[0.15]"
          className="right-[-6%] bottom-[20%]"
        />
        <ElegantShape
          delay={0.6}
          width={180}
          height={50}
          rotate={22}
          gradient="from-cyan-500/[0.12]"
          className="right-[18%] top-[12%]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 max-w-3xl text-center">
        

        <motion.div
          custom={1}
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
              Join the 
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              conversation
            </span>
          </h2>
        </motion.div>

        <motion.p
          custom={2}
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-base md:text-lg text-white/40 mb-12 leading-relaxed font-light tracking-wide max-w-xl mx-auto"
        >
          Millions of people are sharing ideas, sparking debates, and building communities.
          Start your story today — it takes 30 seconds.
        </motion.p>

        <motion.div
          custom={3}
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <SignInButton forceRedirectUrl="/dashboard">
              <motion.a
                href="#"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black text-sm font-semibold tracking-wide transition-colors hover:bg-white/90"
              >
                Get started — it's free
              </motion.a>
          </SignInButton>
          <motion.a
            href="#"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white/[0.04] border border-white/[0.12] text-white text-sm font-medium tracking-wide transition-colors hover:bg-white/[0.08]"
          >
            See what's trending
          </motion.a>
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/60 pointer-events-none" />
    </section>
  );
}

// ─── Full page export ─────────────────────────────────────────────────────────

export function HomeSections() {
  return (
    <>
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
    </>
  );
}

export { FeaturesSection, HowItWorksSection, StatsSection, CTASection };