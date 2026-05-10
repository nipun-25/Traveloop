"use client";

import { Trip } from "@/types";
import { formatDateRange, cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ShareModal from "./share-modal";

interface TripHeaderProps {
  trip: Trip;
}

export default function TripHeader({ trip }: TripHeaderProps) {
  const pathname = usePathname();
  const [showShareModal, setShowShareModal] = useState(false);
  const dateRange = formatDateRange(trip.start_date, trip.end_date);

  const tabs = [

    { name: "Overview", href: `/trips/${trip.id}` },
    { name: "Itinerary", href: `/trips/${trip.id}/itinerary` },
    { name: "Budget", href: `/trips/${trip.id}/budget` },
    { name: "Packing", href: `/trips/${trip.id}/packing` },
    { name: "Notes", href: `/trips/${trip.id}/notes` },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-full hover:bg-surface-muted text-neutral-400 hover:text-foreground transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
              Trip Plan
            </span>
          </div>
          <h1 className="text-4xl font-bold text-foreground font-display tracking-tight">
            {trip.name}
          </h1>
          <p className="text-neutral-500 flex items-center gap-2 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4"
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

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowShareModal(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.367A2.5 2.5 0 0113 4.5z" />
            </svg>
            Share
          </Button>
          <Button variant="secondary" size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
            Edit
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                isActive
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-500 hover:text-foreground hover:border-neutral-300"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {showShareModal && (
        <ShareModal
          tripId={trip.id}
          isPublic={trip.is_public}
          shareSlug={trip.share_slug}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>

  );
}

// Internal Button component for the header to avoid import cycles if any
function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: any) {
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-surface text-foreground border border-border hover:bg-surface-muted",
    ghost: "bg-transparent hover:bg-surface-muted",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-lg)] font-medium transition-all",
        variants[variant as keyof typeof variants],
        sizes[size as keyof typeof sizes],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
