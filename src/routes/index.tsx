import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPicker } from "@/components/UserPicker";
import { formatNumber, numericMetrics, textMetrics, users } from "@/data/wrapped";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gerrit Wrapped 2026 — The team's year in code" },
      {
        name: "description",
        content:
          "Commits, merges, lines added and reviews for Adam, Christian, Nima, Dilan and Theo — side by side.",
      },
      { property: "og:title", content: "Gerrit Wrapped 2026" },
      {
        property: "og:description",
        content: "See who topped the team in commits, merges, lines added and reviews.",
      },
    ],
  }),
  component: Index,
});

const accentVar: Record<string, string> = {
  lime: "var(--lime)",
  pink: "var(--pink)",
  sky: "var(--sky)",
  amber: "var(--amber)",
};

function Index() {
  return (
    <main className="wrapped-bg min-h-screen">
      <div className="mx-auto w-full max-w-md px-5 pb-20 pt-10">
        <header className="animate-rise">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            2026 edition
          </p>
          <h1 className="text-gradient mt-2 text-5xl font-black leading-[0.95]">
            Gerrit
            <br />
            Wrapped
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            The whole team's year in code, side by side.
          </p>
        </header>

        <div className="mt-6">
          <UserPicker />
        </div>

        <section className="mt-10 grid gap-5">
          {numericMetrics.map((metric, i) => {
            const ranked = [...users].sort((a, b) => b[metric.key] - a[metric.key]);
            const top = ranked[0]!;
            const max = top[metric.key];
            return (
              <article
                key={metric.key}
                className="animate-rise card-glass rounded-3xl p-5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <h2 className="min-w-0 truncate text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {metric.label}
                  </h2>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-background"
                    style={{ background: accentVar[metric.accent] }}
                  >
                    👑 {top.name}
                  </span>
                </div>
                <ul className="mt-4 grid gap-3">
                  {ranked.map((u) => (
                    <li key={u.name}>
                      <Link
                        to="/u/$user"
                        params={{ user: u.name }}
                        className="block"
                        aria-label={`${u.name} — ${metric.label}`}
                      >
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2">
                          <span className="min-w-0 truncate text-sm font-bold">{u.name}</span>
                          <span className="shrink-0 text-sm font-bold tabular-nums text-muted-foreground">
                            {formatNumber(u[metric.key])}
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(u[metric.key] / max) * 100}%`,
                              background: accentVar[metric.accent],
                            }}
                          />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}

          {textMetrics.map((metric, i) => (
            <article
              key={metric.key}
              className="animate-rise card-glass rounded-3xl p-5"
              style={{ animationDelay: `${(i + 4) * 80}ms` }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {metric.label}
              </h2>
              <ul className="mt-3 divide-y divide-white/10">
                {users.map((u) => (
                  <li
                    key={u.name}
                    className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 py-2.5"
                  >
                    <span className="shrink-0 text-sm font-bold">{u.name}</span>
                    <span className="min-w-0 truncate text-right text-sm text-muted-foreground">
                      {u[metric.key]}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <p className="mt-10 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Tap a name to open their Wrapped
        </p>
      </div>
    </main>
  );
}
