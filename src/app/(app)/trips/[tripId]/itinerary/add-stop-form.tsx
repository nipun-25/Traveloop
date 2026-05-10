"use client";

import { useState } from "react";
import { addStop } from "./actions";
import { Button, Input, Card } from "@/components/ui";

interface AddStopFormProps {
  tripId: string;
  onSuccess?: () => void;
}

export default function AddStopForm({ tripId, onSuccess }: AddStopFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await addStop(tripId, formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      event.currentTarget.reset();
      if (onSuccess) onSuccess();
    }
  }

  return (
    <Card variant="bordered" className="p-5 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.758.433 8.136 8.136 0 00.28.14l.019.008.006.003zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="font-bold text-foreground">Add a Destination</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City Name"
            name="city_name"
            placeholder="e.g., Paris"
            required
          />
          <Input
            label="Country"
            name="country"
            placeholder="e.g., France"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Arrival Date"
            name="start_date"
            type="date"
            required
          />
          <Input
            label="Departure Date"
            name="end_date"
            type="date"
            required
          />
        </div>

        {error && (
          <div className="p-2.5 rounded-[var(--radius-md)] bg-error-light text-error text-xs font-medium border border-error/20">
            {error}
          </div>
        )}

        <Button type="submit" isLoading={isLoading} size="sm" className="mt-1">
          Add to Itinerary
        </Button>
      </form>
    </Card>
  );
}
