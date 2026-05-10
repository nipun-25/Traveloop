import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTripById } from '../actions';
import { Calendar, MapPin, Wallet, StickyNote, Luggage, Route, Share2, ArrowRight, Clock } from 'lucide-react';

const NAV_CARDS = [
  { icon: <Route size={20} />, title: "Itinerary", desc: "Build your day-wise plan", href: "itinerary", color: "#2d4a35" },
  { icon: <Wallet size={20} />, title: "Budget", desc: "Track costs & spending", href: "budget", color: "#d97706" },
  { icon: <StickyNote size={20} />, title: "Notes", desc: "Journal & reminders", href: "notes", color: "#5b4db5" },
  { icon: <Luggage size={20} />, title: "Packing", desc: "Checklist for your trip", href: "packing", color: "#e56040" },
];

export default async function TripDetailPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const trip = await getTripById(tripId);
  if (!trip) notFound();

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const days = Math.max(1, Math.ceil((new Date(trip!.end_date).getTime() - new Date(trip!.start_date).getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #2d4a35 0%, #1a3020 100%)", borderRadius: 20, padding: "36px 36px 28px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 600, borderRadius: 9999, padding: "5px 14px", background: "rgba(255,255,255,0.2)", color: "#fff" }}>
              {new Date(trip.start_date) > new Date() ? "Upcoming" : "Active"}
            </span>
            {trip.is_public && (
              <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 9999, padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#fff" }}>
                <Share2 size={14} /> Shared
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, marginBottom: 8 }}>{trip.name}</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, maxWidth: 600, marginBottom: 20 }}>
            {trip!.description || "No description yet. Add one to remember what this trip is about!"}
          </p>
          <div style={{ display: "flex", gap: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Calendar size={16} /></div>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Dates</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{formatDate(trip!.start_date)} – {formatDate(trip!.end_date)}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Clock size={16} /></div>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Duration</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{days} Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {NAV_CARDS.map((card) => (
          <Link key={card.title} href={`/trips/${tripId}/${card.href}`} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "24px 20px", textDecoration: "none", display: "block", borderTop: `3px solid ${card.color}`, transition: "all 0.2s" }} className="nav-link-card">
            <div style={{ width: 40, height: 40, borderRadius: 12, background: card.color + "15", color: card.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{card.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{card.title}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{card.desc}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#2d4a35", marginTop: 14 }}>Open <ArrowRight size={13} /></div>
          </Link>
        ))}
      </div>

      {/* About */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "28px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>About This Trip</div>
        <div style={{ fontSize: 14, color: "#555", lineHeight: 1.8 }}>
          {trip!.description || "No description provided. Edit this trip to add a description."}
        </div>
      </div>

      <style>{`.nav-link-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.08); transform: translateY(-3px); }`}</style>
    </div>
  );
}
