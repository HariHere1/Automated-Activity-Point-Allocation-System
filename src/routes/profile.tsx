import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppLayout, GlassCard } from "@/components/AppLayout";
import { STUDENT, currentAcademicYear } from "@/lib/ktu-data";
import { selectClass } from "@/components/CertificateForm";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — KTU Activity Points Portal" },
      {
        name: "description",
        content: "Your roll number, batch, admission year and editable contact details.",
      },
      { property: "og:title", content: "Profile — KTU Activity Points Portal" },
      { property: "og:description", content: "Student record and contact information." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const [phone, setPhone] = useState(STUDENT.phone);
  const [altEmail, setAltEmail] = useState(STUDENT.altEmail);
  const year = currentAcademicYear(STUDENT.admissionYear);

  return (
    <AppLayout title="Profile" subtitle="Academic details come from the college record and are read-only.">
      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard className="space-y-3">
          <h2 className="text-sm font-semibold">Student record</h2>
          <Row label="Name" value={STUDENT.name} />
          <Row label="Roll number" value={STUDENT.rollNo} />
          <Row label="Branch" value={STUDENT.branch} />
          <Row label="Batch" value={STUDENT.batch} />
          <Row label="Admission year" value={String(STUDENT.admissionYear)} />
          <Row label="Current academic year" value={`Year ${year}`} />
          <Row label="College email" value={STUDENT.email} />
        </GlassCard>

        <GlassCard className="space-y-4">
          <h2 className="text-sm font-semibold">Contact details</h2>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Phone</span>
            <input className={selectClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Alternate email</span>
            <input
              className={selectClass}
              value={altEmail}
              onChange={(e) => setAltEmail(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={() => toast.success("Contact details saved")}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Save changes
          </button>
        </GlassCard>
      </div>
    </AppLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-2 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
