import { Trip } from "@/types";
import { Card, Button } from "@/components/ui";
import { formatDateRange } from "@/lib/utils";
import Link from "next/link";

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const dateRange = formatDateRange(trip.start_date, trip.end_date);

  return (
    <Card hover padding="none" className="group flex flex-col h-full overflow-hidden bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
      {/* Photo Placeholder/Cover */}
      <div className="relative h-52 bg-[#050a19] overflow-hidden">
        {trip.cover_photo_url ? (
          <img
            src={trip.cover_photo_url}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a6fcd]/20 to-[#f5a623]/10 flex items-center justify-center">
             <span className="text-4xl font-bold opacity-10 font-display tracking-widest text-white">TRAVELOOP</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg shadow-xl">
            Upcoming
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#050a19] via-transparent to-transparent opacity-60" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-white font-display tracking-wide mb-1 line-clamp-1 group-hover:text-[#f5a623] transition-colors">
            {trip.name}
          </h3>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path
                fillRule="evenodd"
                d="M4 1.75a.75.75 0 011.5 0V3h5V1.75a.75.75 0 011.5 0V3h1.25c.69 0 1.25.56 1.25 1.25v8.5c0 .69-.56 1.25-1.25 1.25H1.5c-.69 0-1.25-.56-1.25-1.25v-8.5c0-.69.56-1.25 1.25-1.25H3V1.75zM12 4.5H1.5v8.5h11v-8.5z"
                clipRule="evenodd"
              />
            </svg>
            {dateRange}
          </p>
        </div>

        {trip.description && (
          <p className="text-xs text-white/50 line-clamp-2 mb-6 font-medium leading-relaxed">
            {trip.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-3">
          <Link href={`/trips/${trip.id}`} className="flex-grow">
            <Button size="sm" fullWidth className="font-bold tracking-widest text-[10px] uppercase">
              Explore Plan
            </Button>
          </Link>
          <Link href={`/trips/${trip.id}/itinerary`}>
            <Button size="sm" variant="secondary" className="px-3 py-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
