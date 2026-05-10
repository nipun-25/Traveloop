"use client";

import { TripStop } from "@/types";
import { Card, Button } from "@/components/ui";
import { formatDateShort, daysBetween } from "@/lib/utils";
import { removeStop } from "./actions";
import { useState } from "react";

interface ItineraryListProps {
  tripId: string;
  initialStops: TripStop[];
}

export default function ItineraryList({ tripId, initialStops }: ItineraryListProps) {
  const [stops, setStops] = useState(initialStops);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  async function handleRemove(stopId: string) {
    if (!confirm("Are you sure you want to remove this stop?")) return;
    
    setIsRemoving(stopId);
    const result = await removeStop(tripId, stopId);
    
    if (result.success) {
      setStops(stops.filter((s) => s.id !== stopId));
    } else {
      alert(result.error);
    }
    setIsRemoving(null);
  }

  if (stops.length === 0) {
    return (
      <div className="py-12 px-6 border-2 border-dashed border-border rounded-[var(--radius-xl)] text-center bg-surface-muted/50">
        <p className="text-neutral-500 text-sm">
          No stops added to this trip yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Connecting Line */}
      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-neutral-200 -z-10" />

      {stops.map((stop, index) => {
        const duration = daysBetween(stop.start_date, stop.end_date);
        
        return (
          <div key={stop.id} className="flex gap-6 animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
            {/* Order Circle */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-primary-500 flex items-center justify-center font-bold text-primary-600 shadow-sm z-10">
              {index + 1}
            </div>

            {/* Content */}
            <Card variant="default" className="flex-grow p-5 hover:border-primary-300 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-foreground">
                      {stop.city?.name}
                    </h3>
                    <span className="text-xs font-medium text-neutral-400">
                      • {stop.city?.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 1.75a.75.75 0 011.5 0V3h5V1.75a.75.75 0 011.5 0V3h1.25c.69 0 1.25.56 1.25 1.25v8.5c0 .69-.56 1.25-1.25 1.25H1.5c-.69 0-1.25-.56-1.25-1.25v-8.5c0-.69.56-1.25 1.25-1.25H3V1.75zM12 4.5H1.5v8.5h11v-8.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formatDateShort(stop.start_date)} - {formatDateShort(stop.end_date)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      {duration} days
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-error hover:bg-error-light"
                    onClick={() => handleRemove(stop.id)}
                    isLoading={isRemoving === stop.id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
