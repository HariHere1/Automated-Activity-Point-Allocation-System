import { Link } from "@tanstack/react-router";
import { Moon, Sun, GraduationCap, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTheme } from "@/lib/portal-store";
import { STUDENT } from "@/lib/ktu-data";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/upload", label: "Upload" },
  { to: "/certificates", label: "My certificates" },
  { to: "/rules", label: "Points guide" },
  { to: "/profile", label: "Profile" },
] as const;

export function AppLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen page-wash">
      <header className="sticky top-0 z-30 glass-soft">
        <div className="mx-auto flex min-h-[64px] w-full max-w-[1720px] items-center gap-3 px-4 py-3 sm:min-h-[72px] sm:gap-5 sm:px-8 sm:py-4 lg:px-12">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm sm:size-11">
              <GraduationCap className="size-5" />
            </span>
            <span className="min-w-0 font-display text-base font-semibold leading-tight tracking-tight sm:text-lg">
              <span className="block truncate">Activity Points</span>
              <span className="block truncate text-xs font-medium text-muted-foreground">
                KTU · {STUDENT.rollNo}
              </span>
            </span>
          </Link>


          <nav className="ml-8 hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-accent text-accent-foreground" }}
                className="rounded-md px-4 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
            <Link
              to="/login"
              className="hidden rounded-md px-4 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              Sign out
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/70 text-muted-foreground md:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>

        </div>

        {open && (
          <nav className="border-t border-border/60 px-4 pb-4 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-foreground" }}
                className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-[15px] font-medium text-muted-foreground"
            >
              Sign out
            </Link>
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold sm:text-4xl">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
          )}
        </div>
        {children}
      </main>


      <footer className="mx-auto max-w-6xl px-4 pb-10 text-sm text-muted-foreground sm:px-6">
        Prototype interface with sample data — no submissions are sent to the university.
      </footer>
    </div>
  );
}

export function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={cn("glass rounded-2xl p-5", className)}>{children}</section>;
}
