import type { Metadata } from "next";
import LandingPage from "@/app/page";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a Traveloop account and start planning your next adventure.",
};

export default function SignupPage() {
  return <LandingPage initialAuthType="signup" />;
}
