import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export const authInput =
  "w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25";

export function AuthShell({
  icon,
  title,
  subtitle,
  children,
  submitLabel,
  onSubmit,
  footer,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
  submitLabel: string;
  onSubmit: () => void;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center page-wash px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            {icon}
          </span>
          <span className="font-display text-base font-semibold">KTU Activity Points</span>
        </Link>

        <form
          className="glass space-y-4 rounded-2xl p-7"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {submitLabel}
          </button>
          <p className="text-center text-sm text-muted-foreground">{footer}</p>
        </form>
      </div>
    </div>
  );
}
