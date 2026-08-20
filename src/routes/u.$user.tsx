import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { UserPicker } from "@/components/UserPicker";
import {
  formatNumber,
  getUser,
  numericMetrics,
  textMetrics,
  users,
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
    )} commits, ${formatNumber(loaderData.user.merges)} merges and ${formatNumber(
      loaderData.user.reviews,
    )} reviews this year.`;
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

const accentVar: Record<string, string> = {
  lime: "var(--lime)",
  pink: "var(--pink)",
  sky: "var(--sky)",
  amber: "var(--amber)",
};

function rank(user: UserStats, key: (typeof numericMetrics)[number]["key"]) {
  const sorted = [...users].sort((a, b) => b[key] - a[key]);
  return sorted.findIndex((u) => u.name === user.name) + 1;
}

function UserWrapped() {
  const { user } = Route.useLoaderData();

  return (
    <main className="wrapped-bg min-h-screen">
      <div className="mx-auto w-full max-w-md px-5 pb-20 pt-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <Link
            to="/"
            className="min-w-0 truncate text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            ← Gerrit Wrapped
          </Link>
          <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-bold">2026</span>
        </div>

        <div className="mt-5">
          <UserPicker value={user.name} />
        </div>

        <section className="animate-rise mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            This year in Gerrit
          </p>
          <h1 className="text-gradient mt-2 text-6xl font-black leading-[0.95]">{user.name}</h1>
        </section>

        <section className="mt-8 grid gap-4">
          {numericMetrics.map((metric, i) => {
            const max = Math.max(...users.map((u) => u[metric.key]));
            const position = rank(user, metric.key);
            return (
              <article
                key={metric.key}
                className="animate-rise card-glass rounded-3xl p-5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <p className="min-w-0 truncate text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {metric.label}
                  </p>
                  <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold">
                    #{position} of {users.length}
                  </span>
                </div>
                <p
                  className="mt-2 text-5xl font-black tabular-nums"
                  style={{ color: accentVar[metric.accent] }}
                >
                  {formatNumber(user[metric.key])}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(user[metric.key] / max) * 100}%`,
                      background: accentVar[metric.accent],
                    }}
                  />
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-4 grid gap-4">
          {textMetrics.map((metric, i) => (
            <article
              key={metric.key}
              className="animate-rise card-glass rounded-3xl p-5"
              style={{ animationDelay: `${(i + 4) * 80}ms` }}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-2 break-words font-display text-2xl font-bold">
                {user[metric.key]}
              </p>
            </article>
          ))}
        </section>

        <Link
          to="/"
          className="mt-8 flex h-12 items-center justify-center rounded-full bg-primary text-sm font-bold uppercase tracking-widest text-primary-foreground"
        >
          Compare everyone
        </Link>
      </div>
    </main>
  );
}
