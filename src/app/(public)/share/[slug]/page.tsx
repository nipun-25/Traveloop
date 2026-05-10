import React from 'react';
import { getPublicTripBySlug } from '@/app/(app)/trips/actions';
import { notFound } from 'next/navigation';
import { MapPin, Calendar, Clock, Share2, Copy, ExternalLink } from 'lucide-react';

export default async function SharedItineraryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getPublicTripBySlug(slug);
  if (!trip) return notFound();

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const days = Math.max(1, Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)));
  const stops = trip.stops || [];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", fontFamily: "'Montserrat', sans-serif", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0ede8; }
      `}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #2d4a35, #1a3020)", borderRadius: 24, padding: "40px", color: "#fff", marginBottom: 32, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <ExternalLink size={12} /> Shared Itinerary
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 12 }}>{trip.name}</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, maxWidth: 560, marginBottom: 20 }}>
            {trip.description || "A curated travel experience."}
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              <Calendar size={14} /> {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              <Clock size={14} /> {days} Days
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              <MapPin size={14} /> {stops.length} Cities
            </span>
          </div>
        </div>
      </div>

      {/* Itinerary Summary */}
      {stops.length > 0 && (
        <>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 20 }}>Itinerary Summary</div>
          {stops.map((stop: any) => (
            <div key={stop.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "24px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={16} color="#2d4a35" />
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
                    {stop.city?.name || "Unknown"}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "#888" }}>
                  {formatDate(stop.start_date)} – {formatDate(stop.end_date)}
                </span>
              </div>
              {stop.city?.country && (
                <span style={{ fontSize: 12, color: "#999" }}>{stop.city.country}</span>
              )}
            </div>
          ))}
        </>
      )}

      {/* Notes */}
      {trip.notes && trip.notes.length > 0 && trip.notes[0].content && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "24px", marginTop: 20 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Travel Notes</div>
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{trip.notes[0].content}</div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 40, padding: "24px", borderTop: "1px solid #e8e4de", fontSize: 12, color: "#aaa" }}>
        Created with <strong>Traveloop</strong> · Read-only view
      </div>
    </div>
  );
}
