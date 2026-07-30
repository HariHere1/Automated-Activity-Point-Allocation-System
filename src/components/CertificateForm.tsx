import { useMemo, useState } from "react";
import { UploadCloud, AlertTriangle, FileCheck2 } from "lucide-react";
import {
  ACTIVITY_TYPES,
  CATEGORIES,
  ROLE_LABELS,
  getActivity,
  getCategory,
  pointsFor,
  type Certificate,
  type Role,
} from "@/lib/ktu-data";
import { usePortal } from "@/lib/portal-store";
import { GlassCard } from "@/components/AppLayout";
import { cn } from "@/lib/utils";

export interface CertificateDraft {
  categoryId: string;
  activityTypeId: string;
  role?: Role;
  customLabel?: string;
  fileName: string;
}

const ACADEMIC_YEARS = ["2025–26", "2024–25", "2023–24", "2022–23"];

export function CertificateForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Certificate;
  submitLabel: string;
  onSubmit: (draft: CertificateDraft & { academicYear: string; points: number }) => void;
}) {
  const { categoryTotals } = usePortal();
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [activityTypeId, setActivityTypeId] = useState(initial?.activityTypeId ?? "");
  const [role, setRole] = useState<Role | "">(initial?.role ?? "");
  const [customLabel, setCustomLabel] = useState(initial?.customLabel ?? "");
  const [fileName, setFileName] = useState(initial?.fileName ?? "");
  const [academicYear, setAcademicYear] = useState(initial?.academicYear ?? ACADEMIC_YEARS[0]);
  const [dragging, setDragging] = useState(false);

  const activities = useMemo(
    () => ACTIVITY_TYPES.filter((a) => a.categoryId === categoryId),
    [categoryId],
  );
  const activity = getActivity(activityTypeId);
  const category = getCategory(categoryId);
  const isOther = activity?.name === "Other";
  const claimPoints = activity
    ? activity.roles
      ? role
        ? activity.roles[role]
        : 0
      : (activity.points ?? 0)
    : 0;

  const currentTotal = category ? (categoryTotals[category.id] ?? 0) : 0;
  const projected = currentTotal + claimPoints;
  const exceeds = !!category && projected > category.cap;

  const valid =
    !!categoryId && !!activityTypeId && !!fileName && (!activity?.roles || !!role) && (!isOther || !!customLabel);

  return (
    <form
      className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onSubmit({
          categoryId,
          activityTypeId,
          role: (role || undefined) as Role | undefined,
          customLabel: isOther ? customLabel : undefined,
          fileName,
          academicYear,
          points: claimPoints,
        });
      }}
    >
      <GlassCard className="space-y-5">
        <Field label="Category">
          <select
            className={selectClass}
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setActivityTypeId("");
              setRole("");
            }}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Activity type">
          <select
            className={selectClass}
            value={activityTypeId}
            disabled={!categoryId}
            onChange={(e) => {
              setActivityTypeId(e.target.value);
              setRole("");
            }}
          >
            <option value="">{categoryId ? "Select an activity type" : "Choose a category first"}</option>
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
                {a.points ? ` — ${a.points} pts` : ""}
              </option>
            ))}
          </select>
          {activity?.note && (
            <p className="mt-1.5 text-xs text-muted-foreground">{activity.note}</p>
          )}
        </Field>

        {activity?.roles && (
          <Field label="Role held">
            <div className="grid gap-2 sm:grid-cols-3">
              {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-left transition-colors",
                    role === r
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border/70 hover:bg-accent/50",
                  )}
                >
                  <span className="block text-sm font-medium">{ROLE_LABELS[r]}</span>
                  <span className="text-xs text-muted-foreground">
                    {activity.roles![r]} points
                  </span>
                </button>
              ))}
            </div>
          </Field>
        )}

        {isOther && (
          <Field label="Describe the activity">
            <input
              className={selectClass}
              value={customLabel}
              placeholder="e.g. District-level science exhibition coordination"
              onChange={(e) => setCustomLabel(e.target.value)}
            />
          </Field>
        )}

        <Field label="Academic year of the activity">
          <select
            className={selectClass}
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          >
            {ACADEMIC_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Certificate file">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) setFileName(f.name);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-9 text-center transition-colors",
              dragging ? "border-primary bg-accent/60" : "border-border bg-background/40",
            )}
          >
            <input
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
            {fileName ? (
              <>
                <FileCheck2 className="size-5 text-success" />
                <span className="text-sm font-medium">{fileName}</span>
                <span className="text-xs text-muted-foreground">Click to replace</span>
              </>
            ) : (
              <>
                <UploadCloud className="size-5 text-muted-foreground" />
                <span className="text-sm font-medium">Drag & drop your certificate</span>
                <span className="text-xs text-muted-foreground">PDF or image, up to 5 MB</span>
              </>
            )}
          </label>
        </Field>
      </GlassCard>

      <GlassCard className="space-y-4 lg:sticky lg:top-24">
        <h2 className="text-sm font-semibold">Claim summary</h2>
        <SummaryRow label="Points this claim is worth" value={`${claimPoints} pts`} strong />
        <SummaryRow
          label={category ? `${category.name} total now` : "Category total now"}
          value={`${currentTotal} pts`}
        />
        <SummaryRow
          label="Category total after this claim"
          value={category ? `${projected} / ${category.cap} pts` : "—"}
          strong
        />
        {category && (
          <p className="text-xs text-muted-foreground">
            Cap scope: {category.capScope === "per_year" ? "per academic year" : "per degree"}
          </p>
        )}

        {exceeds && (
          <div className="flex gap-2 rounded-xl border border-warning/40 bg-warning/12 p-3 text-xs text-warning">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>
              This claim would push {category?.name} past its {category?.cap}-point cap. You can
              still submit — only points up to the cap will count.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!valid}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {submitLabel}
        </button>
      </GlassCard>
    </form>
  );
}

const selectClass =
  "w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-sm", strong ? "font-semibold" : "font-medium")}>{value}</span>
    </div>
  );
}

export { selectClass };
