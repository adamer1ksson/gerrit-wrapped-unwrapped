import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  formatNumber,
  getUser,
  numericMetrics,
  parseCounted,
  textMetrics,
  users,
  type NumericMetricKey,
  type TextMetricKey,
  type UserStats,
} from "@/data/wrapped";

export const Route = createFileRoute("/u/$user")({
  loader: ({ params }) => {
    const user = getUser(params.user);
    if (!user) throw notFound();
    return { user };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — Gerrit Wrapped" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.user.name}'s Gerrit Wrapped 2026`;
    const description = `${loaderData.user.name} landed ${formatNumber(
      loaderData.user.commits,
    )} commits, ${formatNumber(loaderData.user.merges)} merges, ${formatNumber(
      loaderData.user.linesAdded,
    )} lines added and ${formatNumber(loaderData.user.reviewsMade)} reviews this year.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: UserWrapped,
});

// ---------------------------------------------------------------------------
// Slide model — one screen per stat, Spotify-Wrapped style.
// ---------------------------------------------------------------------------

type Slide =
  | { kind: "intro" }
  | { kind: "number"; key: NumericMetricKey; label: string; caption: string }
  | { kind: "text"; key: TextMetricKey; label: string; caption: string }
  | { kind: "summary" };

const numberCaptions: Record<NumericMetricKey, string> = {
  commits: "Change-Ids you pushed into the world.",
  merges: "Times you brought it all together.",
  linesAdded: "Lines added — give or take a rebase.",
  reviewsMade: "+1s and −1s you handed out.",
};

const textCaptions: Record<TextMetricKey, string> = {
  mostEditedFile: "Your file on repeat this year.",
  mostUsedAiTag: "Your signature AI tag.",
  mostTargetedJiraTicket: "The ticket that owned your year.",
};

const numberHeadline: Record<NumericMetricKey, string> = {
  commits: "You committed",
  merges: "You merged",
  linesAdded: "You wrote",
  reviewsMade: "You reviewed",
};

const numberUnit: Record<NumericMetricKey, string> = {
  commits: "commits",
  merges: "merges",
  linesAdded: "lines",
  reviewsMade: "reviews",
};

function buildSlides(): Slide[] {
  return [
    { kind: "intro" },
    ...numericMetrics.map(
      (m): Slide => ({ kind: "number", key: m.key, label: m.label, caption: numberCaptions[m.key] }),
    ),
    ...textMetrics.map(
      (m): Slide => ({ kind: "text", key: m.key, label: m.label, caption: textCaptions[m.key] }),
    ),
    { kind: "summary" },
  ];
}

// Vibrant duotone theme per slide, Wrapped-style. fg is the on-color for text.
const THEMES: { bg: string; fg: string; blobA: string; blobB: string }[] = [
  { bg: "linear-gradient(165deg,#6423E8,#E93BB0)", fg: "#ffffff", blobA: "#FF9CE3", blobB: "#8A5CFF" }, // intro
  { bg: "linear-gradient(165deg,#1ED760,#0B6E3B)", fg: "#052012", blobA: "#B8FFD4", blobB: "#0AE87A" }, // commits
  { bg: "linear-gradient(165deg,#FF6B6B,#B0146B)", fg: "#ffffff", blobA: "#FFC1C1", blobB: "#FF3D8B" }, // merges
  { bg: "linear-gradient(165deg,#45E0FF,#1150C9)", fg: "#04121f", blobA: "#BFF3FF", blobB: "#3B8CFF" }, // lines
  { bg: "linear-gradient(165deg,#FFD23F,#FF7A00)", fg: "#1a1200", blobA: "#FFF0B0", blobB: "#FFA23F" }, // reviews
  { bg: "linear-gradient(165deg,#B14BFF,#4B0BA0)", fg: "#ffffff", blobA: "#E6C1FF", blobB: "#8A2BE2" }, // most edited file
  { bg: "linear-gradient(165deg,#00E5A8,#0A5C8A)", fg: "#04160e", blobA: "#B0FFEC", blobB: "#12C9D6" }, // ai tag
  { bg: "linear-gradient(165deg,#FF4FD8,#7A1FA2)", fg: "#ffffff", blobA: "#FFC7F3", blobB: "#C13BFF" }, // jira
  { bg: "linear-gradient(165deg,#1a1a1a,#2e2e2e)", fg: "#ffffff", blobA: "#1DB954", blobB: "#E93BB0" }, // summary
];

const SLIDE_MS = 5000;

function rank(user: UserStats, key: NumericMetricKey) {
  const sorted = [...users].sort((a, b) => b[key] - a[key]);
  return sorted.findIndex((u) => u.name === user.name) + 1;
}

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  const suffix = s[(v - 20) % 10] ?? s[v] ?? s[0] ?? "th";
  return `${n}${suffix}`;
};

// Animated count-up. Runs whenever `runKey` changes (i.e. slide becomes active).
function useCountUp(target: number, runKey: string, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, runKey, duration]);
  return value;
}

function UserWrapped() {
  const { user } = Route.useLoaderData();
  const navigate = useNavigate();
  const slides = buildSlides();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = slides.length;
  const slide = slides[index]!;
  const theme = THEMES[index] ?? THEMES[0]!;

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);
  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  // Auto-advance like a story. Pause on the final (summary) slide and on hold.
  useEffect(() => {
    if (paused || index >= total - 1) return;
    const t = setTimeout(() => setIndex((i) => Math.min(i + 1, total - 1)), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, total]);

  // Keyboard navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") navigate({ to: "/" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, navigate]);

  // Tap left third = back, right two-thirds = forward. Long-press = pause.
  const pointerStart = useRef<{ x: number; w: number }>({ x: 0, w: 1 });
  const onPointerDown = (e: React.PointerEvent) => {
    holdTimer.current = setTimeout(() => setPaused(true), 260);
    pointerStart.current = { x: e.clientX, w: window.innerWidth };
  };
  const onPointerUp = () => {
    const wasHold = paused;
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setPaused(false);
    if (wasHold) return; // releasing a long-press should not navigate
    const { x, w } = pointerStart.current;
    if (x < w * 0.33) prev();
    else next();
  };

  return (
    <main
      className="story-stage"
      style={{ background: theme.bg, color: theme.fg }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Floating background blobs */}
      <div
        className="story-blob"
        style={{ background: theme.blobA, width: "60vw", height: "60vw", top: "-10%", left: "-15%" }}
      />
      <div
        className="story-blob"
        style={{
          background: theme.blobB,
          width: "55vw",
          height: "55vw",
          bottom: "-12%",
          right: "-18%",
          animationDelay: "1.5s",
        }}
      />

      {/* Segmented progress bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex gap-1.5 px-3 pt-3">
        {slides.map((_, i) => {
          const done = i < index;
          const active = i === index;
          const running = active && !paused && index < total - 1;
          return (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-black/25">
              <div
                key={`${i}-${index}-${paused}`}
                className="h-full rounded-full bg-current"
                style={{
                  width: done || (active && !running) ? "100%" : running ? undefined : "0%",
                  animation: running ? `seg-fill ${SLIDE_MS}ms linear forwards` : undefined,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-6 text-xs font-bold uppercase tracking-[0.2em]">
        <span className="opacity-80">Gerrit Wrapped ’26</span>
        <button
          type="button"
          aria-label="Close"
          onPointerUp={(e) => {
            e.stopPropagation();
            navigate({ to: "/" });
          }}
          className="rounded-full bg-black/15 px-3 py-1 backdrop-blur"
        >
          ✕
        </button>
      </div>

      {/* Slide content — keyed by index so animations & count-ups restart */}
      <div key={index} className="relative z-10 flex h-full flex-col justify-center px-7">
        <SlideBody slide={slide} user={user} index={index} />
      </div>
    </main>
  );
}

function SlideBody({ slide, user, index }: { slide: Slide; user: UserStats; index: number }) {
  if (slide.kind === "intro") {
    return (
      <div className="animate-slide-up">
        <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-80">Your 2026 in Gerrit</p>
        <h1 className="mt-3 text-7xl font-black leading-[0.9]">{user.name}</h1>
        <p className="mt-6 max-w-xs text-lg font-medium opacity-90">
          Let’s rewind the year you spent in the codebase. Tap to begin →
        </p>
      </div>
    );
  }

  if (slide.kind === "number") {
    return <NumberSlide slide={slide} user={user} runKey={String(index)} />;
  }

  if (slide.kind === "text") {
    const { count, label } = parseCounted(user[slide.key]);
    return (
      <div className="animate-slide-up">
        <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-80">{slide.label}</p>
        <p className="mt-6 break-words font-display text-5xl font-black leading-[1.02]">{label}</p>
        {count && (
          <span className="mt-6 inline-block rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold backdrop-blur">
            {count}× this year
          </span>
        )}
        <p className="mt-6 max-w-xs text-lg font-medium opacity-90">{slide.caption}</p>
      </div>
    );
  }

  // summary
  return <SummarySlide user={user} />;
}

function NumberSlide({
  slide,
  user,
  runKey,
}: {
  slide: Extract<Slide, { kind: "number" }>;
  user: UserStats;
  runKey: string;
}) {
  const value = useCountUp(user[slide.key], runKey);
  const position = rank(user, slide.key);
  return (
    <div>
      <p className="animate-slide-up text-sm font-bold uppercase tracking-[0.3em] opacity-80">
        {numberHeadline[slide.key]}
      </p>
      <p className="animate-pop mt-2 text-[5.5rem] font-black leading-[0.85] tabular-nums">
        {formatNumber(value)}
      </p>
      <p className="animate-slide-up mt-1 text-3xl font-black opacity-90">{numberUnit[slide.key]}</p>
      <div className="animate-slide-up mt-6 flex items-center gap-3">
        <span className="rounded-full bg-black/20 px-4 py-1.5 text-sm font-bold backdrop-blur">
          {position === 1 ? "👑 #1 on the team" : `${ordinal(position)} on the team`}
        </span>
      </div>
      <p className="animate-slide-up mt-5 max-w-xs text-lg font-medium opacity-90">{slide.caption}</p>
    </div>
  );
}

function SummarySlide({ user }: { user: UserStats }) {
  return (
    <div className="animate-pop">
      <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-80">That’s a wrap</p>
      <h2 className="mt-2 text-4xl font-black leading-none">{user.name}’s 2026</h2>

      <div className="share-card mt-6 rounded-3xl p-5">
        <div className="grid grid-cols-2 gap-4">
          {numericMetrics.map((m) => (
            <div key={m.key}>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] opacity-60">
                {m.label}
              </p>
              <p className="mt-0.5 text-2xl font-black tabular-nums">
                {formatNumber(user[m.key])}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
          {textMetrics.map((m) => {
            const { count, label } = parseCounted(user[m.key]);
            return (
              <div key={m.key}>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] opacity-60">
                  {m.label}
                </p>
                <p className="mt-0.5 break-words text-sm font-bold">
                  {label}
                  {count && <span className="ml-2 opacity-60">({count}×)</span>}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.25em] opacity-50">
          Gerrit Wrapped 2026
        </p>
      </div>

      <a
        href="/"
        onPointerUp={(e) => e.stopPropagation()}
        className="mt-6 flex h-12 items-center justify-center rounded-full bg-white text-sm font-black uppercase tracking-widest text-black"
      >
        Compare the whole team
      </a>
    </div>
  );
}
