import type { Metadata } from "next";
import ForgotPasswordForm from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Traveloop password.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground font-display">
            Reset your password
          </h1>
          <p className="text-neutral-500 mt-2">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>
        
        <ForgotPasswordForm />
      </div>
    </main>
  );
}

