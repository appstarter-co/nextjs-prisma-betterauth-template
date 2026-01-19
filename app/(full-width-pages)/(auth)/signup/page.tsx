import { SignupForm } from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignUp Page | Appstarter - Next.js Dashboard Template",
  description: "This is Next.js SignUp Page Appstarter Dashboard Template",
  // other metadata
};

export default function SignUp() {
  return <SignupForm />;
}
