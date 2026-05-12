import React from 'react';
import Link from 'next/link';
import { getTrips } from './actions';
import { 
  PlusCircle, 
  Map, 
  Calendar, 
  ChevronRight, 
  Image as ImageIcon,
  Compass
} from 'lucide-react';

function getTripStatus(start: string, end: string) {
  const now = Date.now();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (now < s) return "Upcoming";
  if (now >= s && now <= e) return "In Progress";
  return "Completed";
}

const statusClasses: Record<string, string> = {
  "Upcoming": "pill-processing",
  "In Progress": "pill-confirmed",
  "Completed": "glass-panel",
};

export default async function MyTripsPage() {
  const trips = await getTrips();
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "'Montserrat', sans-serif" }}>
      <header className="trip-list-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 32, color: "white", marginBottom: 8, letterSpacing: "-0.02em" }}>My Trips</h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 500 }}>Explore your past and future journeys.</p>
        </div>
        <Link
          href="/trips/create-trip"
          className="new-trip-btn"
          style={{
            padding: "14px 28px",
            background: "var(--primary)",
            color: "white",
            borderRadius: 16,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: "0 10px 20px rgba(26, 111, 205, 0.2)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <PlusCircle size={18} />
          New Trip
        </Link>
      </header>

      {trips.length === 0 ? (
        <section className="glass-panel" style={{ padding: "100px 40px", textAlign: 'center', borderRadius: 32, border: '1px dashed var(--outline)' }}>
          <div style={{ color: 'var(--primary)', opacity: 0.3, marginBottom: 24 }}>
            <Compass size={64} />
          </div>
          <h2 style={{ fontSize: 24, color: 'white', marginBottom: 12 }}>No trips found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 400, marginInline: 'auto', fontWeight: 500 }}>
            Your adventure hasn't started yet. Create your first itinerary to see it here.
          </p>
          <Link href="/trips/create-trip" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 16, textDecoration: 'none', background: 'var(--primary-container)', padding: '12px 24px', borderRadius: 12 }}>
            Start Planning Now
          </Link>
        </section>
      ) : (
        <div className="trips-container" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {trips.map((trip) => {
            const status = getTripStatus(trip.start_date, trip.end_date);
            const statusClass = statusClasses[status] || "glass-panel";
            
            return (
              <Link key={trip.id} href={`/trips/${trip.id}`} style={{ textDecoration: 'none' }}>
                <div className="booking-item glass-panel trip-card-row" style={{ padding: 24, borderRadius: 24, border: '1px solid var(--outline-variant)', display: "flex", alignItems: "center", gap: 32 }}>
                    <div className="trip-card-image" style={{
                      width: 140, height: 140, borderRadius: 20,
                      background: trip.cover_photo_url ? `url(${trip.cover_photo_url}) center/cover` : 'var(--surface-container-high)',
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: 'hidden', border: '1px solid var(--outline-variant)'
                    }}>
                      {!trip.cover_photo_url && <Compass size={40} color="var(--primary)" opacity={0.2} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>{trip.name}</h3>
                        <span className={statusClass} style={{ fontSize: 10 }}>{status}</span>
                      </div>
                      <p className="trip-card-desc" style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 500 }}>
                        {trip.description || "Explore the wonders of the world and create unforgettable memories with every step of your journey."}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold)', fontSize: 13, fontWeight: 700 }}>
                          <Calendar size={16} />
                          {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
                        </div>
                      </div>
                    </div>
                  <div className="trip-card-chevron" style={{ paddingLeft: 24 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--outline-variant)' }}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

