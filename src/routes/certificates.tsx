import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, GlassCard } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { usePortal } from "@/lib/portal-store";
import { ROLE_LABELS, activityLabel, getCategory } from "@/lib/ktu-data";
import { AlertCircle, Pencil } from "lucide-react";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "My certificates — KTU Activity Points Portal" },
      {
        name: "description",
        content:
          "Status tracker for every submitted certificate, with flag reasons and resubmission actions.",
      },
      { property: "og:title", content: "My certificates — KTU Activity Points Portal" },
      {
        property: "og:description",
        content: "Pending, approved, flagged and rejected claims in one list.",
      },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  const { certificates } = usePortal();

  return (
    <AppLayout
      title="My certificates"
      subtitle="Every claim you have submitted, newest first. A dot marks rows that changed since your last visit."
    >
      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left text-xs text-muted-foreground">
              <th className="px-5 py-3 font-medium">Activity</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Year</th>
              <th className="px-5 py-3 font-medium">Points</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((c) => {
              const needsFix = c.status === "flagged" || c.status === "rejected";
              return (
                <tr key={c.id} className="border-b border-border/50 align-top last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-2">
                      {c.changedSinceLastVisit && (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                      )}
                      <div>
                        <p className="font-medium">{activityLabel(c)}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.fileName}
                          {c.role ? ` · ${ROLE_LABELS[c.role]}` : ""} · submitted {c.submittedOn}
                        </p>
                        {needsFix && c.reason && (
                          <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-destructive/25 bg-destructive/8 px-2.5 py-1.5 text-xs text-destructive">
                            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                            {c.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {getCategory(c.categoryId)?.name}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">
                    {c.academicYear}
                  </td>
                  <td className="px-5 py-4 font-medium whitespace-nowrap">{c.points}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-4">
                    {needsFix && (
                      <Link
                        to="/resubmit/$id"
                        params={{ id: c.id }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                      >
                        <Pencil className="size-3.5" />
                        Edit & resubmit
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>
    </AppLayout>
  );
}
