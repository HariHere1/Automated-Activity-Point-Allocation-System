import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { AppLayout, GlassCard } from "@/components/AppLayout";
import { CertificateForm } from "@/components/CertificateForm";
import { usePortal } from "@/lib/portal-store";

export const Route = createFileRoute("/resubmit/$id")({
  head: () => ({
    meta: [
      { title: "Edit & resubmit — KTU Activity Points Portal" },
      {
        name: "description",
        content: "Correct a flagged or rejected certificate claim and submit it again for review.",
      },
      { property: "og:title", content: "Edit & resubmit — KTU Activity Points Portal" },
      {
        property: "og:description",
        content: "Fix the flagged detail and resubmit your activity point claim.",
      },
    ],
  }),
  component: ResubmitPage,
});

function ResubmitPage() {
  const { id } = useParams({ from: "/resubmit/$id" });
  const { certificates, updateCertificate } = usePortal();
  const navigate = useNavigate();
  const cert = certificates.find((c) => c.id === id);

  if (!cert) {
    return (
      <AppLayout title="Certificate not found">
        <GlassCard>
          <p className="text-sm text-muted-foreground">
            This claim no longer exists.{" "}
            <Link to="/certificates" className="text-primary hover:underline">
              Back to my certificates
            </Link>
          </p>
        </GlassCard>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Edit & resubmit"
      subtitle="Your previous submission is pre-filled. Fix the issue below and submit again."
    >
      {cert.reason && (
        <div className="mb-5 flex items-start gap-2 rounded-2xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{cert.reason}</span>
        </div>
      )}
      <CertificateForm
        initial={cert}
        submitLabel="Resubmit claim"
        onSubmit={(draft) => {
          updateCertificate(cert.id, {
            ...draft,
            status: "pending",
            reason: undefined,
            changedSinceLastVisit: true,
            submittedOn: new Date().toISOString().slice(0, 10),
          });
          toast.success("Claim resubmitted", { description: "It is pending verification again." });
          navigate({ to: "/certificates" });
        }}
      />
    </AppLayout>
  );
}
