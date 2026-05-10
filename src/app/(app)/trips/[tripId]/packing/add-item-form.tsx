"use client";

import { useState } from "react";
import { addPackingItem } from "./actions";
import { Button, Input, Card } from "@/components/ui";

interface AddPackingItemFormProps {
  tripId: string;
}

export default function AddPackingItemForm({ tripId }: AddPackingItemFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await addPackingItem(tripId, formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      event.currentTarget.reset();
    }
  }

  return (
    <Card variant="bordered" className="p-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </div>
          <h3 className="font-bold text-foreground text-sm">Add Item</h3>
        </div>

        <Input
          label="Item Name"
          name="item_name"
          placeholder="e.g., Passport"
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Category
          </label>
          <select
            name="category"
            className="w-full px-4 py-2.5 rounded-[var(--radius-lg)] border border-border bg-surface text-foreground text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
          >
            <option value="Clothing">Clothing</option>
            <option value="Toiletries">Toiletries</option>
            <option value="Electronics">Electronics</option>
            <option value="Documents">Documents</option>
            <option value="Medicine">Medicine</option>
            <option value="Accessories">Accessories</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {error && (
          <div className="p-2 rounded-[var(--radius-md)] bg-error-light text-error text-xs font-medium border border-error/20">
            {error}
          </div>
        )}

        <Button type="submit" size="sm" isLoading={isLoading}>
          Add to List
        </Button>
      </form>
    </Card>
  );
}
