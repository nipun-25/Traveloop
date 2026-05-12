import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Traveloop account to manage your trips.",
};

export default function LoginPage() {
  return <LoginForm />;
}
