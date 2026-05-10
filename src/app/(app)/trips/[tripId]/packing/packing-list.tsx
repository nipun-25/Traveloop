"use client";

import { PackingItem } from "@/types";
import { Card, Button } from "@/components/ui";
import { togglePackingItem, removePackingItem } from "./actions";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PackingListProps {
  tripId: string;
  initialItems: PackingItem[];
}

export default function PackingList({ tripId, initialItems }: PackingListProps) {
  const [items, setItems] = useState(initialItems);

  // Group items by category
  const categories = Array.from(new Set(items.map((i) => i.category)));

  async function handleToggle(itemId: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setItems(items.map(i => i.id === itemId ? { ...i, is_packed: newStatus } : i));
    
    const result = await togglePackingItem(tripId, itemId, newStatus);
    if (!result.success) {
      // Revert on error
      setItems(items.map(i => i.id === itemId ? { ...i, is_packed: currentStatus } : i));
      alert(result.error);
    }
  }

  async function handleRemove(itemId: string) {
    if (!confirm("Remove this item?")) return;
    
    const result = await removePackingItem(tripId, itemId);
    if (result.success) {
      setItems(items.filter(i => i.id !== itemId));
    } else {
      alert(result.error);
    }
  }

  if (items.length === 0) {
    return (
      <div className="py-12 px-6 border-2 border-dashed border-border rounded-[var(--radius-xl)] text-center bg-surface-muted/50">
        <p className="text-neutral-500 text-sm">
          Your packing list is empty. Start adding items!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {categories.map((category) => (
        <div key={category} className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest px-1">
            {category}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {items
              .filter((i) => i.category === category)
              .map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-[var(--radius-lg)] border transition-all group",
                    item.is_packed
                      ? "bg-surface-muted border-transparent opacity-60"
                      : "bg-surface border-border hover:border-primary-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(item.id, item.is_packed)}
                      className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                        item.is_packed
                          ? "bg-primary-500 border-primary-500 text-white"
                          : "border-neutral-300 hover:border-primary-400"
                      )}
                    >
                      {item.is_packed && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <span className={cn(
                      "text-sm font-medium text-foreground transition-all",
                      item.is_packed && "line-through text-neutral-400"
                    )}>
                      {item.item_name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 p-1.5 h-auto text-neutral-400 hover:text-error"
                    onClick={() => handleRemove(item.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                      <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
                    </svg>
                  </Button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
