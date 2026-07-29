export type CapScope = "per_degree" | "per_year";

export type Role = "core" | "sub" | "volunteer";

export const ROLE_LABELS: Record<Role, string> = {
  core: "Core coordinator",
  sub: "Sub coordinator",
  volunteer: "Volunteer",
};

export interface ActivityType {
  id: string;
  name: string;
  categoryId: string;
  /** flat point value, when the activity has no role tiers */
  points?: number;
  /** role tiered point values */
  roles?: Record<Role, number>;
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  cap: number;
  capScope: CapScope;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "leadership",
    name: "Leadership & Management",
    cap: 40,
    capScope: "per_degree",
    description: "Coordination and leadership roles in approved bodies and events.",
  },
  {
    id: "innovation",
    name: "Innovation & Entrepreneurship",
    cap: 80,
    capScope: "per_degree",
    description: "Prototypes, products, funding and startup activity.",
  },
  {
    id: "nptel",
    name: "NPTEL / MOOC",
    cap: 50,
    capScope: "per_year",
    description: "One certificate can be claimed per academic year.",
  },
];

const tier = { core: 15, sub: 10, volunteer: 5 } satisfies Record<Role, number>;

export const ACTIVITY_TYPES: ActivityType[] = [
  {
    id: "lead-societies",
    categoryId: "leadership",
    name: "Student Professional Societies (IEEE, IET, ASME, SAE, NASA etc.)",
    roles: tier,
  },
  { id: "lead-chapters", categoryId: "leadership", name: "College Association Chapters", roles: tier },
  {
    id: "lead-events",
    categoryId: "leadership",
    name: "Festival & Technical Events (college approved)",
    roles: tier,
  },
  { id: "lead-hobby", categoryId: "leadership", name: "Hobby Clubs", roles: tier },
  {
    id: "lead-special",
    categoryId: "leadership",
    name: "Special Initiatives",
    roles: tier,
    note: "College + university approval required",
  },
  { id: "lead-other", categoryId: "leadership", name: "Other", roles: tier },

  { id: "inv-prototype", categoryId: "innovation", name: "Prototype developed and tested", points: 60 },
  { id: "inv-awards", categoryId: "innovation", name: "Awards for products developed", points: 60 },
  {
    id: "inv-industry",
    categoryId: "innovation",
    name: "Innovative technologies developed and used by industries/users",
    points: 60,
  },
  {
    id: "inv-vc",
    categoryId: "innovation",
    name: "Got venture capital funding for innovative ideas/products",
    points: 80,
  },
  {
    id: "inv-startup",
    categoryId: "innovation",
    name: "Startup employment (2+ people, ≥ Rs.15,000/month)",
    points: 80,
  },
  { id: "inv-societal", categoryId: "innovation", name: "Societal innovations", points: 50 },
  { id: "inv-other", categoryId: "innovation", name: "Other", points: 50 },

  { id: "nptel-12", categoryId: "nptel", name: "NPTEL course — 12 week", points: 50 },
  { id: "nptel-8", categoryId: "nptel", name: "NPTEL course — 8 week", points: 40 },
  { id: "nptel-4", categoryId: "nptel", name: "NPTEL course — 4 week", points: 25 },
  { id: "mooc-other", categoryId: "nptel", name: "Other MOOC (SWAYAM, Coursera, edX)", points: 20 },
  { id: "nptel-other", categoryId: "nptel", name: "Other", points: 20 },
];

export type CertificateStatus = "pending" | "auto_approved" | "flagged" | "reviewed" | "rejected";

export const STATUS_LABELS: Record<CertificateStatus, string> = {
  pending: "Pending",
  auto_approved: "Auto-approved",
  flagged: "Flagged",
  reviewed: "Reviewed",
  rejected: "Rejected",
};

export interface Certificate {
  id: string;
  categoryId: string;
  activityTypeId: string;
  customLabel?: string;
  role?: Role;
  fileName: string;
  submittedOn: string;
  academicYear: string;
  points: number;
  status: CertificateStatus;
  reason?: string;
  changedSinceLastVisit?: boolean;
}

export function getActivity(id: string) {
  return ACTIVITY_TYPES.find((a) => a.id === id);
}

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export function activityLabel(cert: Certificate) {
  const a = getActivity(cert.activityTypeId);
  if (a?.name === "Other") return cert.customLabel || "Other";
  return a?.name ?? "Unknown activity";
}

export function pointsFor(activityTypeId: string, role?: Role) {
  const a = getActivity(activityTypeId);
  if (!a) return 0;
  if (a.roles) return role ? a.roles[role] : 0;
  return a.points ?? 0;
}

/** Points that actually count toward the 100 — approved states only. */
export const COUNTING_STATUSES: CertificateStatus[] = ["auto_approved", "reviewed"];

export const REQUIRED_POINTS = 100;

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "c1",
    categoryId: "leadership",
    activityTypeId: "lead-societies",
    role: "core",
    fileName: "ieee-sb-secretary.pdf",
    submittedOn: "2025-08-14",
    academicYear: "2025–26",
    points: 15,
    status: "auto_approved",
  },
  {
    id: "c2",
    categoryId: "leadership",
    activityTypeId: "lead-events",
    role: "sub",
    fileName: "tathva-sub-coordinator.pdf",
    submittedOn: "2025-09-02",
    academicYear: "2025–26",
    points: 10,
    status: "reviewed",
    changedSinceLastVisit: true,
  },
  {
    id: "c3",
    categoryId: "nptel",
    activityTypeId: "nptel-12",
    fileName: "nptel-dbms-12wk.pdf",
    submittedOn: "2025-06-21",
    academicYear: "2024–25",
    points: 50,
    status: "auto_approved",
  },
  {
    id: "c4",
    categoryId: "nptel",
    activityTypeId: "nptel-8",
    fileName: "nptel-cloud-8wk.pdf",
    submittedOn: "2025-10-05",
    academicYear: "2024–25",
    points: 40,
    status: "flagged",
    reason: "NPTEL duplicate — a certificate is already claimed for 2024–25.",
    changedSinceLastVisit: true,
  },
  {
    id: "c5",
    categoryId: "leadership",
    activityTypeId: "lead-hobby",
    role: "volunteer",
    fileName: "photography-club.jpg",
    submittedOn: "2025-10-19",
    academicYear: "2025–26",
    points: 5,
    status: "pending",
  },
  {
    id: "c6",
    categoryId: "innovation",
    activityTypeId: "inv-prototype",
    fileName: "solar-dryer-prototype.pdf",
    submittedOn: "2025-07-30",
    academicYear: "2025–26",
    points: 60,
    status: "flagged",
    reason: "Name mismatch — certificate name does not match roll number records.",
  },
  {
    id: "c7",
    categoryId: "leadership",
    activityTypeId: "lead-chapters",
    role: "core",
    fileName: "iedc-lead.pdf",
    submittedOn: "2025-05-11",
    academicYear: "2024–25",
    points: 15,
    status: "rejected",
    reason: "Category cap exceeded — Leadership & Management is capped at 40 points per degree.",
  },
];

export const STUDENT = {
  name: "Harigovind",
  rollNo: "SJC20EC039",
  email: "hari@college.ac.in",
  branch: "Computer Science & Engineering",
  batch: "2022–2026",
  admissionYear: 2022,
  phone: "+91 1234566780",
  altEmail: "hari.govind.dev@gmail.com",
};

export function currentAcademicYear(admissionYear: number) {
  const now = new Date();
  const yearsIn = now.getFullYear() - admissionYear + (now.getMonth() >= 6 ? 1 : 0);
  return Math.min(Math.max(yearsIn, 1), 4);
}
