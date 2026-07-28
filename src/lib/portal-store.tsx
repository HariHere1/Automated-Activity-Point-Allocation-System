import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CATEGORIES,
  COUNTING_STATUSES,
  MOCK_CERTIFICATES,
  REQUIRED_POINTS,
  type Certificate,
} from "./ktu-data";

interface PortalState {
  certificates: Certificate[];
  addCertificate: (c: Omit<Certificate, "id">) => string;
  updateCertificate: (id: string, patch: Partial<Certificate>) => void;
  earnedPoints: number;
  pendingPoints: number;
  remaining: number;
  categoryTotals: Record<string, number>;
}

const Ctx = createContext<PortalState | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [certificates, setCertificates] = useState<Certificate[]>(MOCK_CERTIFICATES);

  const addCertificate = useCallback((c: Omit<Certificate, "id">) => {
    const id = `c${Math.random().toString(36).slice(2, 8)}`;
    setCertificates((prev) => [{ ...c, id }, ...prev]);
    return id;
  }, []);

  const updateCertificate = useCallback((id: string, patch: Partial<Certificate>) => {
    setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const value = useMemo<PortalState>(() => {
    const counting = certificates.filter((c) => COUNTING_STATUSES.includes(c.status));
    const categoryTotals: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      const raw = counting
        .filter((c) => c.categoryId === cat.id)
        .reduce((sum, c) => sum + c.points, 0);
      categoryTotals[cat.id] = Math.min(raw, cat.cap);
    }
    const earnedPoints = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    const pendingPoints = certificates
      .filter((c) => c.status === "pending" || c.status === "flagged")
      .reduce((sum, c) => sum + c.points, 0);

    return {
      certificates,
      addCertificate,
      updateCertificate,
      earnedPoints,
      pendingPoints,
      remaining: Math.max(REQUIRED_POINTS - earnedPoints, 0),
      categoryTotals,
    };
  }, [certificates, addCertificate, updateCertificate]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePortal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePortal must be used inside PortalProvider");
  return ctx;
}

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("ktu-theme");
    const initial = stored === "dark" ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      window.localStorage.setItem("ktu-theme", next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
