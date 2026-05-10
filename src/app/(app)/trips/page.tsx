import React from 'react';
import Link from 'next/link';
import { getTrips } from './actions';
import { Calendar, MapPin, Eye, Plus, Plane } from 'lucide-react';

const statusColors: Record<string, { bg: string; text: string }> = {
  "Upcoming": { bg: "#dce8dc", text: "#2d4a35" },
  "In Progress": { bg: "#e3e0f5", text: "#5b4db5" },
  "Completed": { bg: "#e8e4de", text: "#666" },
};

function getTripStatus(start: string, end: string) {
  const now = Date.now();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (now < s) return "Upcoming";
  if (now >= s && now <= e) return "In Progress";
  return "Completed";
}

export default async function MyTripsPage() {
  const trips = await getTrips();
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>My Trips</h1>
          <p style={{ fontSize: 14, color: "#888" }}>Access and manage all your travel plans.</p>
        </div>
        <Link href="/trips/create-trip" style={{ display: "flex", alignItems: "center", gap: 8, background: "#2d4a35", color: "#fff", borderRadius: 9999, padding: "12px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          <Plus size={16} /> New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 20, border: "2px dashed #ddd8d0", padding: "60px 32px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#aaa" }}><Plane size={24} /></div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>No trips yet</div>
          <div style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>Start your journey by creating your first trip.</div>
          <Link href="/trips/new" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#2d4a35", color: "#fff", borderRadius: 9999, padding: "12px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Create your first trip →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {trips.map((trip) => {
            const status = getTripStatus(trip.start_date, trip.end_date);
            const colors = statusColors[status] || statusColors["Completed"];
            return (
              <Link key={trip.id} href={`/trips/${trip.id}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "stretch", background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s", cursor: "pointer" }} className="trip-list-card">
                  <div style={{ width: 180, minHeight: 140, background: "linear-gradient(135deg, #c8c8c8 0%, #e0ddd8 60%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <MapPin size={28} style={{ opacity: 0.2, color: "#fff" }} />
                  </div>
                  <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{trip.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, borderRadius: 9999, padding: "4px 12px", background: colors.bg, color: colors.text }}>{status}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#888", marginBottom: 12, lineHeight: 1.5 }}>{trip.description || "No description"}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#999" }}><Calendar size={13} /> {formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", padding: "20px" }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #e8e4de", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}><Eye size={15} /></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <style>{`.trip-list-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }`}</style>
    </div>
  );
}
