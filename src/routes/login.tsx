import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { AuthShell, authInput } from "@/components/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — KTU Activity Points Portal" },
      {
        name: "description",
        content: "Sign in with your roll number to manage activity point certificates.",
      },
      { property: "og:title", content: "Sign in — KTU Activity Points Portal" },
      { property: "og:description", content: "Student access to the activity points dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  return (
    <AuthShell
      icon={<GraduationCap className="size-5" />}
      title="Sign in"
      subtitle="Use your college roll number and password."
      onSubmit={() => navigate({ to: "/" })}
      submitLabel="Sign in"
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Roll number</span>
        <input className={authInput} defaultValue="TKM22CS041" placeholder="TKM22CS041" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Password</span>
        <input className={authInput} type="password" defaultValue="password" />
      </label>
    </AuthShell>
  );
}
