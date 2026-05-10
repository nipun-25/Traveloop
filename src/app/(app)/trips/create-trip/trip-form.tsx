"use client";

import { useState } from "react";
import { createTrip } from "../actions";
import { Button, Input, Card } from "@/components/ui";

export default function TripForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await createTrip(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // Success redirects automatically via server action
  }

  return (
    <Card className="animate-fade-in p-6 shadow-[var(--shadow-md)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Trip Name"
          name="name"
          placeholder="e.g., Summer in Europe"
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="start_date"
            type="date"
            required
          />
          <Input
            label="End Date"
            name="end_date"
            type="date"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Description (Optional)
          </label>
          <textarea
            name="description"
            rows={4}
            className="w-full px-4 py-2.5 rounded-[var(--radius-lg)] border border-border bg-surface text-foreground placeholder:text-neutral-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-neutral-400"
            placeholder="What's this trip about?"
          />
        </div>

        {error && (
          <div className="p-3 rounded-[var(--radius-md)] bg-error-light text-error text-xs font-medium border border-error/20">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Trip
          </Button>
        </div>
      </form>
    </Card>
  );
}
