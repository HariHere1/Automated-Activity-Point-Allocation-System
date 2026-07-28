import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import { AppLayout, GlassCard } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { usePortal } from "@/lib/portal-store";
import {
  CATEGORIES,
  REQUIRED_POINTS,
  STUDENT,
  activityLabel,
  currentAcademicYear,
} from "@/lib/ktu-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — KTU Activity Points Portal" },
      {
        name: "description",
        content:
          "See your earned activity points, category-wise caps and recently updated certificates at a glance.",
      },
      { property: "og:title", content: "Dashboard — KTU Activity Points Portal" },
      {
        property: "og:description",
        content: "Track progress toward the 100 activity points required for graduation.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { earnedPoints, pendingPoints, remaining, categoryTotals, certificates } = usePortal();
  const pct = Math.min((earnedPoints / REQUIRED_POINTS) * 100, 100);
  const recent = certificates.filter((c) => c.changedSinceLastVisit);
  const year = currentAcademicYear(STUDENT.admissionYear);

  return (
    <AppLayout
      title={`Hello, ${STUDENT.name.split(" ")[0]}`}
      subtitle={`Year ${year} · ${STUDENT.branch} · Batch ${STUDENT.batch}`}
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <GlassCard className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <ProgressRing value={pct} earned={earnedPoints} />
          <div className="space-y-3">
            <p className="text-lg font-semibold">
              {remaining > 0 ? `${remaining} points to go` : "Requirement complete"}
            </p>
            <p className="text-sm text-muted-foreground">
              {earnedPoints} of {REQUIRED_POINTS} points approved
              {pendingPoints > 0 && ` · ${pendingPoints} points awaiting a decision`}.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Upload a certificate
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Changed since your last visit</h2>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing new. All submissions unchanged.</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{activityLabel(c)}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.points} pts · {c.academicYear}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/certificates"
            className="inline-block text-sm font-medium text-primary hover:underline"
          >
            View all certificates
          </Link>
        </GlassCard>
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold">Category-wise breakdown</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const earned = categoryTotals[cat.id] ?? 0;
          const width = Math.min((earned / cat.cap) * 100, 100);
          return (
            <GlassCard key={cat.id} className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-snug">{cat.name}</h3>
                <span className="rounded-full border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground whitespace-nowrap">
                  {cat.capScope === "per_year" ? "per year" : "per degree"}
                </span>
              </div>
              <p className="text-2xl font-semibold">
                {earned}
                <span className="text-sm font-normal text-muted-foreground"> / {cat.cap} pts</span>
              </p>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{cat.description}</p>
            </GlassCard>
          );
        })}
      </div>
    </AppLayout>
  );
}

function ProgressRing({ value, earned }: { value: number; earned: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-36 shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} className="fill-none stroke-muted" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          className="fill-none stroke-primary transition-[stroke-dashoffset] duration-700"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold">{earned}</span>
        <span className="text-xs text-muted-foreground">of {REQUIRED_POINTS} pts</span>
      </div>
    </div>
  );
}
