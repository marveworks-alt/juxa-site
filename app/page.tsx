"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Users, Clock, Sparkles, ToggleRight, Scan, MessageCircle } from "lucide-react";

/**
 * Juxa Landing Page — Hero + Sticky Nav + How it Works + Email Capture
 * Drop this file into Next.js App Router as `app/page.tsx`.
 * TailwindCSS required. Install: `npm i framer-motion lucide-react`
 * Brand colors: Indigo #2E2A78, Teal #1FA7A0, Amber #FF9C66, Slate #0E1116, Off-White #F5F7FA
 */

/**
 * Dev self-checks (run only in development on the client)
 * These serve as lightweight tests without altering app behavior.
 */
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valids = [
    "test@example.com",
    "user.name+tag@sub.domain.co.uk",
    "a_b-c@d.io",
    "x@y.z",
  ];
  const invalids = [
    "bad@",
    "@example.com",
    "foo@bar",
    "foo@.com",
    "foo@bar..com",
    " ",
  ];
  valids.forEach((e) => console.assert(re.test(e), `Email should be valid: ${e}`));
  invalids.forEach((e) => console.assert(!re.test(e), `Email should be invalid: ${e}`));
}

function JuxaMark({ size = 28, stroke = 5, gap = 0.18, rotate = -20, className = "" }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const dashMain = circumference * (1 - gap);
  const dashGap = circumference * gap;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden>
      <g transform={`rotate(${rotate} ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1FA7A0"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dashMain} ${dashGap}`}
        />
      </g>
    </svg>
  );
}

function BrandWordmark({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <JuxaMark size={28} stroke={5} />
      <span className="font-semibold tracking-tight text-white">Juxa</span>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-xl p-2 bg-white/10 ring-1 ring-white/15">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold leading-5">{title}</p>
        <p className="text-sm text-white/70 leading-5">{desc}</p>
      </div>
    </div>
  );
}

function DeviceMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative mx-auto w-full max-w-sm"
      aria-hidden
    >
      <div className="relative rounded-[2.2rem] border border-white/10 bg-gradient-to-b from-[#2E2A78] to-[#201C66] p-4 shadow-2xl">
        {/* Notch */}
        <div className="mx-auto mb-3 h-5 w-40 rounded-b-2xl bg-black/50" />
        {/* Screen */}
        <div className="relative rounded-3xl bg-[#0E1116] p-5 overflow-hidden ring-1 ring-white/10">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#1FA7A0]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-[#FF9C66]/20 blur-3xl" />

          {/* Header */}
          <div className="flex items-center justify-between">
            <BrandWordmark />
            <div className="text-xs text-white/60">Open to hello</div>
          </div>

          {/* Big ring with subtle motion */}
          <div className="mt-6 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="relative"
            >
              <JuxaMark size={180} stroke={14} />
              {/* Small amber dot near the opening */}
              <div className="absolute -top-1 right-7 h-2.5 w-2.5 rounded-full bg-[#FF9C66]" />
            </motion.div>
          </div>

          {/* Toggle card */}
          <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Open to Hello</p>
                <p className="text-xs text-white/70">Visible for 30 minutes • Double‑opt‑in</p>
              </div>
              <button className="group relative inline-flex items-center gap-2 rounded-full bg-[#1FA7A0] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
                <span>Toggle</span>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/10">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function EmailCapture() {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [campus, setCampus] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [lastSubmitted, setLastSubmitted] = React.useState<{ email: string; name: string; campus: string } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, campus, source: 'landing' }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Request failed');
      }
      setLastSubmitted({ email, name, campus });
      setSubmitted(true);
      // Clear the form fields on success
      setName("");
      setCampus("");
      setEmail("");
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="get" className="mx-auto w-full max-w-3xl px-6 py-14">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Get early access</h3>
            <p className="mt-2 text-sm text-white/70">Be first to try Juxa on campus and at partner events. No spam—just launch updates.</p>
          </div>
          <JuxaMark size={34} stroke={6} />
        </div>
        {!submitted ? (
          <form onSubmit={onSubmit} className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label htmlFor="name" className="sr-only">Full name</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm placeholder-white/50 outline-none backdrop-blur transition focus:border-white/30 sm:col-span-1"
            />

            <label htmlFor="campus" className="sr-only">Campus / Organization</label>
            <input
              id="campus"
              type="text"
              required
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              placeholder="Campus / Organization"
              className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm placeholder-white/50 outline-none backdrop-blur transition focus:border-white/30 sm:col-span-1"
            />

            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm placeholder-white/50 outline-none backdrop-blur transition focus:border-white/30 sm:col-span-2"
            />

            <div className="sm:col-span-2 mt-1 flex items-center justify-between gap-3">
              <p className="text-xs text-white/50">By subscribing, you agree to our <a href="#privacy" className="underline hover:text-white">Privacy Policy</a>.</p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-[#1FA7A0] px-6 py-3 text-sm font-semibold text-black shadow-sm transition hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Notify me"}
              </button>
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-2xl bg-red-400/10 p-3 text-sm text-red-200 ring-1 ring-red-400/30">{error}</div>
            )}
          </form>
        ) : (
          <div className="mt-5 rounded-2xl bg-[#1FA7A0]/10 p-4 text-sm text-white">
            {lastSubmitted ? (
              <>
                Thanks, <span className="font-semibold">{lastSubmitted.name}</span>! We’ve added <span className="font-semibold">{lastSubmitted.email}</span> for <span className="font-semibold">{lastSubmitted.campus}</span> to the early-access list.
              </>
            ) : (
              <>Thanks! You’re on the list. We’ll be in touch soon.</>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function HowItWorks() {
  const items = [
    {
      icon: ToggleRight,
      title: "Toggle Open to Hello",
      desc: "Opt‑in for a 30-minute window. You’re visible only while it’s on.",
    },
    { icon: Scan, title: "See Hello Cards", desc: "Discover people within range who opted in near you." },
    {
      icon: Users,
      title: "Double‑opt‑in",
      desc: "Only mutual picks can chat—no cold DMs or unwanted pings.",
    },
    { icon: MessageCircle, title: "Chat, then pin or let it fade", desc: "Ephemeral by default for safety and focus." },
  ];

  return (
    <section id="how" className="mx-auto w-full max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
        <p className="mt-3 text-white/80">Small, safe, time‑boxed micro‑intros. No always‑on tracking. No creep.</p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 ring-1 ring-white/10"
          >
            <div className="mb-3 inline-flex rounded-xl bg-white/10 p-2 ring-1 ring-white/15">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-white/70">{it.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Safety blurb */}
      <div id="safety" className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
          <div className="mb-3 inline-flex rounded-xl bg-white/10 p-2 ring-1 ring-white/15"><ShieldCheck className="h-5 w-5" /></div>
          <h3 className="text-base font-semibold">Safety & privacy</h3>
          <p className="mt-2 text-sm text-white/70">Double‑opt‑in chat, block/report controls, fine‑grained visibility windows, and privacy by design. No public trails.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
          <div className="mb-3 inline-flex rounded-xl bg-white/10 p-2 ring-1 ring-white/15"><Clock className="h-5 w-5" /></div>
          <h3 className="text-base font-semibold">Time‑boxed by default</h3>
          <p className="mt-2 text-sm text-white/70">Sessions last 30–60 minutes. Chats expire unless both decide to pin them.</p>
        </div>
        <div id="events" className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
          <div className="mb-3 inline-flex rounded-xl bg-white/10 p-2 ring-1 ring-white/15"><Sparkles className="h-5 w-5" /></div>
          <h3 className="text-base font-semibold">Event Rooms</h3>
          <p className="mt-2 text-sm text-white/70">Join campus & conference rooms for guided icebreakers and organizer insights. A lighter alternative to heavy event apps.</p>
        </div>
      </div>
    </section>
  );
}

export default function JuxaLanding() {
  return (
    <main className="min-h-screen bg-[#0E1116] text-white antialiased">
      {/* Background ornaments */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-[38rem] w-[38rem] rounded-full bg-[#1FA7A0]/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-[#FF9C66]/10 blur-3xl" />
        <motion.div initial={{ opacity: 0.4, rotate: -10 }} animate={{ opacity: 0.7, rotate: 0 }} transition={{ duration: 1.2 }} className="absolute left-[-20rem] top-40">
          <JuxaMark size={420} stroke={18} />
        </motion.div>
      </div>

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-[#0E1116]/70 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <BrandWordmark className="text-white" />
          <div className="hidden items-center gap-7 md:flex text-sm text-white/80">
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#safety" className="hover:text-white">Safety</a>
            <a href="#events" className="hover:text-white">For events</a>
            <a href="#get" className="hover:text-white">Get access</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#get" className="rounded-full bg-[#1FA7A0] px-5 py-2 text-sm font-semibold text-black shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">Get Juxa</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-10 md:grid-cols-2 lg:gap-16">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Open to hello.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }} className="mt-4 max-w-xl text-lg text-white/80">
            Meet people right next to you—safely, with double‑opt‑in. Juxa gives you a 30‑minute window to connect, then lets the moment fade unless you both choose to keep it.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#get" className="inline-flex items-center justify-center rounded-full bg-[#1FA7A0] px-6 py-3 text-sm font-semibold text-black shadow-sm transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">Get Juxa</a>
            <a href="#how" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">How it works</a>
          </motion.div>

          {/* Features */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Feature icon={ShieldCheck} title="Consent first" desc="You’re visible only when you toggle Open to Hello." />
            <Feature icon={Users} title="Double‑opt‑in" desc="Only mutual picks can chat—no cold DMs." />
            <Feature icon={Clock} title="Time‑boxed" desc="30‑minute sessions keep things light and focused." />
            <Feature icon={Sparkles} title="Event Rooms" desc="Join rooms at campuses & events with live prompts." />
          </div>
        </div>
        <DeviceMock />
      </section>

      {/* How it Works + Safety + Events */}
      <HowItWorks />

      {/* Email Capture */}
      <EmailCapture />

      {/* Footer */}
      <footer className="mx-auto w-full max-w-7xl px-6 pb-10">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row">
          <div className="flex items-center gap-2">
            <JuxaMark size={18} stroke={4} />
            <span>© {new Date().getFullYear()} Juxa</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-white">Privacy</a>
            <a href="#terms" className="hover:text-white">Terms</a>
            <a href="#safety" className="hover:text-white">Safety</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
