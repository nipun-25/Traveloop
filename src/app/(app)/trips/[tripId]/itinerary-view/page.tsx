"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Clock, DollarSign, List, CalendarDays } from 'lucide-react';

const ITINERARY = [
  {
    city: "Rome",
    country: "Italy",
    days: [
      { date: "Sep 12", day: "Day 1", activities: [
        { time: "10:00 AM", name: "Colosseum Tour", duration: "2h", cost: "$35" },
        { time: "1:00 PM", name: "Lunch at Trastevere", duration: "1.5h", cost: "$25" },
        { time: "3:30 PM", name: "Vatican Museums", duration: "3h", cost: "$20" },
      ]},
      { date: "Sep 13", day: "Day 2", activities: [
        { time: "9:00 AM", name: "Pantheon Visit", duration: "1h", cost: "Free" },
        { time: "11:00 AM", name: "Trevi Fountain & Spanish Steps", duration: "2h", cost: "Free" },
        { time: "2:00 PM", name: "Food Tour", duration: "3h", cost: "$65" },
      ]},
    ]
  },
  {
    city: "Positano",
    country: "Italy",
    days: [
      { date: "Sep 15", day: "Day 4", activities: [
        { time: "9:00 AM", name: "Beach Day at Spiaggia Grande", duration: "4h", cost: "$15" },
        { time: "2:00 PM", name: "Path of the Gods Hike", duration: "3h", cost: "Free" },
        { time: "7:00 PM", name: "Sunset Dinner", duration: "2h", cost: "$80" },
      ]},
    ]
  },
  {
    city: "Amalfi",
    country: "Italy",
    days: [
      { date: "Sep 18", day: "Day 7", activities: [
        { time: "10:00 AM", name: "Cathedral of St. Andrew", duration: "1h", cost: "$5" },
        { time: "12:00 PM", name: "Limoncello Tasting", duration: "1.5h", cost: "$20" },
        { time: "3:00 PM", name: "Boat Tour of the Coast", duration: "3h", cost: "$55" },
      ]},
    ]
  }
];

const S = {
  backLink: { display: "flex", alignItems: "center", gap: 6, color: "#888", fontSize: 13, fontWeight: 500, textDecoration: "none", marginBottom: 28 },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#888" },
  toggleRow: { display: "flex", gap: 8 },
  toggleBtn: (active: boolean) => ({ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9999, border: active ? "none" : "1px solid #d8d4ce", background: active ? "#2d4a35" : "transparent", color: active ? "#fff" : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer" }),
  cityBlock: { marginBottom: 32 },
  cityHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "14px 20px", background: "#fff", borderRadius: 14, border: "1px solid #e8e4de" },
  cityName: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a" },
  cityCountry: { fontSize: 12, color: "#999" },
  dayBlock: { marginBottom: 16, paddingLeft: 20, borderLeft: "2px solid #e8e4de" },
  dayLabel: { fontSize: 13, fontWeight: 700, color: "#2d4a35", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 },
  dayDate: { fontSize: 12, fontWeight: 500, color: "#888" },
  activityCard: { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12, background: "#fff", border: "1px solid #f0ede8", marginBottom: 8 },
  actTime: { fontSize: 12, fontWeight: 700, color: "#2d4a35", minWidth: 70, flexShrink: 0 },
  actName: { fontSize: 14, fontWeight: 600, color: "#1a1a1a", flex: 1 },
  actMeta: { display: "flex", alignItems: "center", gap: 12 },
  actTag: { display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#999", background: "#f8f6f3", padding: "3px 8px", borderRadius: 6 },
};

export default function ItineraryViewPage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  return (
    <div>
      <Link href="/dashboard" style={S.backLink}><ArrowLeft size={15} /> Back to Trip</Link>

      <div style={S.header}>
        <div>
          <h1 style={S.title}>Itinerary View</h1>
          <p style={S.subtitle}>Review your complete day-wise travel plan.</p>
        </div>
        <div style={S.toggleRow}>
          <button style={S.toggleBtn(viewMode === "list")} onClick={() => setViewMode("list")}><List size={14} /> List</button>
          <button style={S.toggleBtn(viewMode === "calendar")} onClick={() => setViewMode("calendar")}><CalendarDays size={14} /> Calendar</button>
        </div>
      </div>

      {ITINERARY.map((stop) => (
        <div key={stop.city} style={S.cityBlock}>
          <div style={S.cityHeader}>
            <MapPin size={18} color="#2d4a35" />
            <div>
              <div style={S.cityName}>{stop.city}</div>
              <div style={S.cityCountry}>{stop.country}</div>
            </div>
          </div>
          {stop.days.map((day) => (
            <div key={day.day} style={S.dayBlock}>
              <div style={S.dayLabel}>
                <Calendar size={14} /> {day.day} <span style={S.dayDate}>— {day.date}</span>
              </div>
              {day.activities.map((act, i) => (
                <div key={i} style={S.activityCard}>
                  <div style={S.actTime}>{act.time}</div>
                  <div style={S.actName}>{act.name}</div>
                  <div style={S.actMeta}>
                    <span style={S.actTag}><Clock size={11} /> {act.duration}</span>
                    <span style={S.actTag}><DollarSign size={11} /> {act.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
