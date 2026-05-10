import React from 'react';
import Link from 'next/link';
import { getTrips } from '../trips/actions';
import { Plus, MapPin, ArrowRight, Calendar, Plane } from 'lucide-react';

export default async function DashboardPage() {
  const trips = await getTrips();

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const daysUntil = (d: string) => {
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days until departure` : diff === 0 ? "Departing today!" : "Trip completed";
  };

  return (
    <div>
      {/* Welcome Row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Welcome back 👋</h1>
          <p style={{ fontSize: 14, color: "#888" }}>Your next extraordinary journey awaits.</p>
        </div>
        <Link href="/trips/create-trip" style={{ display: "flex", alignItems: "center", gap: 8, background: "#2d4a35", color: "#fff", border: "none", borderRadius: 9999, padding: "12px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
          <Plus size={16} /> Plan New Trip
        </Link>
      </div>

      {/* Trip Section */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Your Trips</div>
        <Link href="/trips" style={{ fontSize: 12, color: "#888", textDecoration: "none" }}>View All</Link>
      </div>

      {trips.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 20, border: "2px dashed #ddd8d0", padding: "60px 32px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#aaa" }}><Plane size={24} /></div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>No trips yet</div>
          <div style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Start your journey by creating your first trip.</div>
          <Link href="/trips/create-trip" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2d4a35", color: "#fff", borderRadius: 9999, padding: "12px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Create your first trip →
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: trips.length === 1 ? "1fr" : "1fr 0.55fr", gap: 16, marginBottom: 28 }}>
          {trips.slice(0, 2).map((trip, idx) => (
            <Link key={trip.id} href={`/trips/${trip.id}`} style={{ textDecoration: "none" }}>
              <div style={{ borderRadius: 16, overflow: "hidden", position: "relative", height: idx === 0 ? 280 : 200, background: "linear-gradient(135deg, #c8c8c8 0%, #e0ddd8 60%)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
                <div style={{ position: "relative", zIndex: 2, padding: "14px 16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "inline-block", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: 11, fontWeight: 600, borderRadius: 9999, padding: "4px 10px", marginBottom: 6 }}>
                      {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 3, fontFamily: "'Playfair Display', serif" }}>{trip.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Plane size={13} /> {daysUntil(trip.start_date)}
                    </div>
                  </div>
                  {idx === 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", color: "#1a1a1a", borderRadius: 9999, padding: "9px 16px", fontSize: 12, fontWeight: 700 }}>
                      View <ArrowRight size={14} />
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
