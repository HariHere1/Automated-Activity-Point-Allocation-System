import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { AuthShell, authInput } from "@/components/AuthShell";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — KTU Activity Points Portal" },
      {
        name: "description",
        content: "Register with your roll number, name and college email to start claiming points.",
      },
      { property: "og:title", content: "Create account — KTU Activity Points Portal" },
      { property: "og:description", content: "Student registration for the activity points portal." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  return (
    <AuthShell
      icon={<UserPlus className="size-5" />}
      title="Create your account"
      subtitle="One account per student, linked to your roll number."
      onSubmit={() => navigate({ to: "/" })}
      submitLabel="Create account"
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Roll number</span>
        <input className={authInput} placeholder="TKM22CS041" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Full name</span>
        <input className={authInput} placeholder="Aparna Menon" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">College email</span>
        <input className={authInput} type="email" placeholder="name@college.ac.in" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Password</span>
        <input className={authInput} type="password" placeholder="At least 8 characters" />
      </label>
    </AuthShell>
  );
}
