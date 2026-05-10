"use client";

import { useState } from "react";
import { updateProfile } from "./actions";
import { Button, Input, Card } from "@/components/ui";
import { Profile } from "@/types";

interface ProfileFormProps {
  profile: Profile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await updateProfile(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setIsLoading(false);
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{profile.name}</h3>
            <p className="text-neutral-500 text-sm">{profile.email}</p>
          </div>
        </div>

        <hr className="border-border" />

        <div className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            defaultValue={profile.name}
            placeholder="Your Name"
            required
          />
          
          <div className="flex flex-col gap-1.5 opacity-60">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
              Email Address (Cannot be changed)
            </label>
            <div className="px-4 py-2.5 rounded-[var(--radius-lg)] bg-surface-muted border border-border text-sm text-neutral-500">
              {profile.email}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-[var(--radius-md)] bg-error-light text-error text-xs font-medium border border-error/20">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-[var(--radius-md)] bg-success-light text-success text-xs font-medium border border-success/20 flex items-center gap-2 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
            </svg>
            Profile updated successfully!
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
