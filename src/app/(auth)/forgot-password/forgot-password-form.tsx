"use client";

import { useState } from "react";
import { forgotPassword } from "../actions";
import { Button, Input, Card } from "@/components/ui";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await forgotPassword(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result?.success) {
      setSuccess(true);
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md animate-fade-in p-8 text-center shadow-[var(--shadow-md)]">
        <div className="w-16 h-16 bg-success-light text-success rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Email Sent</h2>
        <p className="text-neutral-500 text-sm mb-6">
          We&apos;ve sent a password reset link to your email address.
        </p>
        <Link href="/login" className="w-full">
          <Button fullWidth>Back to Login</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md animate-fade-in p-6 shadow-[var(--shadow-md)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        {error && (
          <div className="p-3 rounded-[var(--radius-md)] bg-error-light text-error text-xs font-medium border border-error/20 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 108 1a7 7 0 000 14zm.75-10.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM8 11a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <Button type="submit" isLoading={isLoading} fullWidth>
          Send Reset Link
        </Button>

        <p className="text-center text-sm text-neutral-500 mt-2">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Log in
          </Link>
        </p>
      </form>
    </Card>
  );
}
