import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, GlassCard } from "@/components/AppLayout";
import { ACTIVITY_TYPES, CATEGORIES, ROLE_LABELS, type Role } from "@/lib/ktu-data";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "Points guide — KTU Activity Points Portal" },
      {
        name: "description",
        content:
          "Reference table of every activity type, its point value or role tiers, and the cap scope that applies.",
      },
      { property: "og:title", content: "Points guide — KTU Activity Points Portal" },
      {
        property: "og:description",
        content: "Check what an activity is worth before you upload the certificate.",
      },
    ],
  }),
  component: RulesPage,
});

function RulesPage() {
  return (
    <AppLayout
      title="Points guide"
      subtitle="What each activity is worth, and how its cap is counted."
    >
      <div className="space-y-6">
        {CATEGORIES.map((cat) => {
          const rows = ACTIVITY_TYPES.filter((a) => a.categoryId === cat.id && a.name !== "Other");
          const tiered = rows.some((r) => r.roles);
          return (
            <GlassCard key={cat.id} className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold">{cat.name}</h2>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </div>
                <span className="rounded-full border border-border/70 px-2.5 py-1 text-xs text-muted-foreground">
                  Cap {cat.cap} pts · {cat.capScope === "per_year" ? "per academic year" : "per degree"}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Activity type</th>
                      {tiered ? (
                        (Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                          <th key={r} className="px-5 py-3 font-medium">
                            {ROLE_LABELS[r]}
                          </th>
                        ))
                      ) : (
                        <th className="px-5 py-3 font-medium">Points</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((a) => (
                      <tr key={a.id} className="border-t border-border/50">
                        <td className="px-5 py-3">
                          {a.name}
                          {a.note && (
                            <span className="block text-xs text-muted-foreground">{a.note}</span>
                          )}
                        </td>
                        {tiered ? (
                          (Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                            <td key={r} className="px-5 py-3 font-medium">
                              {a.roles ? a.roles[r] : "—"}
                            </td>
                          ))
                        ) : (
                          <td className="px-5 py-3 font-medium">{a.points}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </AppLayout>
  );
}
