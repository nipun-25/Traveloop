import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTripById } from '../actions';
import { 
  Map as MapIcon, 
  CreditCard, 
  FileText, 
  Luggage, 
  Calendar, 
  Clock, 
  Edit3, 
  Share2, 
  ArrowRight,
  Compass
} from 'lucide-react';

const NAV_CARDS = [
  { icon: Compass, title: "Itinerary", desc: "Build your day-wise plan", href: "itinerary-view", color: "var(--accent-light)" },
  { icon: CreditCard, title: "Budget", desc: "Track costs & spending", href: "budget", color: "var(--gold)" },
  { icon: FileText, title: "Notes", desc: "Journal & reminders", href: "notes", color: "var(--primary)" },
  { icon: Luggage, title: "Packing", desc: "Checklist for your trip", href: "packing", color: "#10b981" },
];

export default async function TripDetailPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const trip = await getTripById(tripId);
  if (!trip) notFound();

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const days = Math.max(1, Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* Hero Section */}
      <section
        className="glass-panel"
        style={{
          borderRadius: 32,
          overflow: "hidden",
          position: "relative",
          minHeight: 380,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 48,
          border: '1px solid var(--outline-variant)'
        }}
      >
        <div style={{
          position: "absolute",
          inset: 0,
          background: trip.cover_photo_url ? `url(${trip.cover_photo_url}) center/cover` : 'linear-gradient(135deg, #1a233a, #0a122a)',
          zIndex: -1,
          transition: 'transform 0.5s'
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: 'linear-gradient(to top, rgba(5, 10, 25, 0.95) 0%, rgba(5, 10, 25, 0.2) 60%, transparent 100%)',
          zIndex: -1
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span className="pill-confirmed" style={{ fontSize: 10 }}>
                {new Date(trip.start_date) > new Date() ? "Upcoming" : "Current Trip"}
              </span>
              {trip.is_public && (
                <span className="pill-processing" style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Share2 size={12} /> Public Trip
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 48, color: "white", marginBottom: 16, lineHeight: 1, letterSpacing: '-0.03em' }}>{trip.name}</h1>
            <div style={{ display: 'flex', gap: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white' }}>
                <Calendar size={18} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: 15 }}>{formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white' }}>
                <Clock size={18} color="var(--gold)" />
                <span style={{ fontWeight: 700, fontSize: 15 }}>{days} Days Journey</span>
              </div>
            </div>
          </div>
          
          <Link
            href={`/trips/edit/${tripId}`}
            style={{
              padding: '14px 28px',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: 16,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 14,
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.3s'
            }}
          >
            <Edit3 size={18} /> Edit Plan
          </Link>
        </div>
      </section>

      {/* Navigation Grid */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
        {NAV_CARDS.map((card) => {
          const CardIcon = card.icon;
          return (
            <Link key={card.title} href={`/trips/${tripId}/${card.href}`} style={{ textDecoration: 'none' }}>
              <div className="glass-panel nav-card-hover" style={{
                padding: 32,
                borderRadius: 24,
                height: '100%',
                border: '1px solid var(--outline-variant)',
                background: 'rgba(255,255,255,0.02)'
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: 'rgba(255,255,255,0.03)',
                  color: card.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 24,
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <CardIcon size={28} strokeWidth={2.5} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 10 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, fontWeight: 500 }}>{card.desc}</p>
                <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Explore <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* About Section */}
      <section className="glass-panel" style={{ padding: 40, borderRadius: 32, border: '1px solid var(--outline-variant)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 20, letterSpacing: '-0.01em' }}>About the Journey</h2>
        <p style={{ fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.8, fontWeight: 500 }}>
          {trip.description || "The world is a book and those who do not travel read only one page. Add a description to this trip to tell its story."}
        </p>
      </section>

    </div>
  );
}

