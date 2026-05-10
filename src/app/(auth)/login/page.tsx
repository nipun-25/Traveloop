import type { Metadata } from "next";
import LandingPage from "@/app/page";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Traveloop account to manage your trips.",
};

export default function LoginPage() {
  return <LandingPage initialAuthType="login" />;
}
