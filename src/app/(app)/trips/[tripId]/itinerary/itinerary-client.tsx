"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, GripVertical, MapPin, Calendar, Trash2 } from 'lucide-react';
import { addStop, removeStop } from './actions';
import type { TripStop } from '@/types';

export default function ItineraryClient({ tripId, initialStops }: { tripId: string; initialStops: TripStop[] }) {
  const [stops, setStops] = useState(initialStops);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddStop(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await addStop(tripId, fd);
    if (result.success && result.data) {
      setStops([...stops, result.data]);
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || "Failed to add stop");
    }
    setLoading(false);
  }

  async function handleRemove(stopId: string) {
    setStops(stops.filter(s => s.id !== stopId));
    await removeStop(tripId, stopId);
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div>
      <Link href={`/trips/${tripId}`} style={{ display: "flex", alignItems: "center", gap: 6, color: "#888", fontSize: 13, fontWeight: 500, textDecoration: "none", marginBottom: 28 }}>
        <ArrowLeft size={15} /> Back to Trip
      </Link>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Itinerary Builder</h1>
          <p style={{ fontSize: 14, color: "#888" }}>Add stops and build your day-wise travel plan.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ display: "flex", alignItems: "center", gap: 8, background: "#2d4a35", color: "#fff", border: "none", borderRadius: 9999, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          <Plus size={16} /> Add Stop
        </button>
      </div>

      {/* Add Stop Form */}
      {showForm && (
        <form onSubmit={handleAddStop} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "24px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>New Stop</div>
          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 12, padding: "10px 14px", fontSize: 13, marginBottom: 14 }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <input name="city_name" placeholder="City name" required style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #e2ddd6", background: "#faf9f7", fontSize: 14, color: "#1a1a1a", outline: "none" }} />
            <input name="country" placeholder="Country" required style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #e2ddd6", background: "#faf9f7", fontSize: 14, color: "#1a1a1a", outline: "none" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <input name="start_date" type="date" required style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #e2ddd6", background: "#faf9f7", fontSize: 14, color: "#1a1a1a", outline: "none" }} />
            <input name="end_date" type="date" required style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #e2ddd6", background: "#faf9f7", fontSize: 14, color: "#1a1a1a", outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={() => setShowForm(false)} style={{ background: "transparent", border: "1px solid #d8d4ce", borderRadius: 9999, padding: "8px 18px", fontSize: 13, fontWeight: 600, color: "#888", cursor: "pointer" }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ background: "#2d4a35", color: "#fff", border: "none", borderRadius: 9999, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>{loading ? "Adding…" : "Add Stop"}</button>
          </div>
        </form>
      )}

      {/* Timeline */}
      {stops.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "2px dashed #ddd8d0", padding: "40px", textAlign: "center", color: "#888", fontSize: 14 }}>
          No stops added yet. Click &quot;Add Stop&quot; to start building your itinerary!
        </div>
      ) : (
        <div style={{ position: "relative", paddingLeft: 32 }}>
          <div style={{ position: "absolute", left: 12, top: 0, bottom: 0, width: 2, background: "#e2ddd6" }} />
          {stops.map((stop) => (
            <div key={stop.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "24px", marginBottom: 16, position: "relative" }}>
              <div style={{ position: "absolute", left: -27, top: 28, width: 12, height: 12, borderRadius: "50%", background: "#2d4a35", border: "3px solid #f0ede8" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <GripVertical size={16} style={{ color: "#ccc", cursor: "grab" }} />
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
                    {stop.city?.name || "Unknown City"}
                  </span>
                  <span style={{ fontSize: 12, color: "#888" }}>{stop.city?.country || ""}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#999" }}>
                    <Calendar size={13} /> {formatDate(stop.start_date)} – {formatDate(stop.end_date)}
                  </span>
                  <button onClick={() => handleRemove(stop.id)} style={{ border: "none", background: "none", color: "#ccc", cursor: "pointer" }}><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
