import { cn } from "@/lib/utils";
import { STATUS_LABELS, type CertificateStatus } from "@/lib/ktu-data";

const STYLES: Record<CertificateStatus, string> = {
  auto_approved: "bg-success/12 text-success border-success/30",
  reviewed: "bg-success/12 text-success border-success/30",
  pending: "bg-warning/15 text-warning border-warning/35",
  flagged: "bg-destructive/10 text-destructive border-destructive/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/40",
};

export function StatusBadge({
  status,
  className,
}: {
  status: CertificateStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
