import LoginForm from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | Appstarter - Next.js Dashboard Template",
  description: "This is Next.js Signin Page Appstarter Dashboard Template",
};

export default function SignIn() {
  return <LoginForm />;
}
