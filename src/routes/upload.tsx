import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { CertificateForm } from "@/components/CertificateForm";
import { usePortal } from "@/lib/portal-store";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload certificate — KTU Activity Points Portal" },
      {
        name: "description",
        content:
          "Submit a certificate, pick its activity type and role tier, and preview the points before claiming.",
      },
      { property: "og:title", content: "Upload certificate — KTU Activity Points Portal" },
      {
        property: "og:description",
        content: "Claim activity points with a live summary of category caps.",
      },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const { addCertificate } = usePortal();
  const navigate = useNavigate();

  return (
    <AppLayout
      title="Upload certificate"
      subtitle="Pick the activity, attach the proof, and see exactly what it is worth before submitting."
    >
      <CertificateForm
        submitLabel="Submit claim"
        onSubmit={(draft) => {
          addCertificate({
            ...draft,
            submittedOn: new Date().toISOString().slice(0, 10),
            status: "pending",
            changedSinceLastVisit: true,
          });
          toast.success("Certificate submitted", {
            description: "It is now pending verification in your status tracker.",
          });
          navigate({ to: "/certificates" });
        }}
      />
    </AppLayout>
  );
}
