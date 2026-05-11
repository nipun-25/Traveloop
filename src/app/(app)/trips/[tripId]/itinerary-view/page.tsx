"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  List, 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard,
  ChevronRight,
  Compass
} from 'lucide-react';

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

export default function ItineraryViewPage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "'Montserrat', sans-serif" }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="./" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--text-muted)', fontSize: 13, fontWeight: 700,
            textDecoration: 'none', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            <ArrowLeft size={16} /> Back to Trip
          </Link>
          <h1 style={{ fontSize: 32, color: "white", marginBottom: 8, letterSpacing: "-0.02em" }}>Itinerary View</h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 500 }}>Your journey, organized by day and destination.</p>
        </div>
        <div className="glass-panel" style={{ padding: 6, borderRadius: 16, display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--outline-variant)' }}>
          <button
            onClick={() => setViewMode("list")}
            style={{
              padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'list' ? 'white' : 'var(--text-muted)',
              fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s'
            }}
          >
            <List size={16} /> List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            style={{
              padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: viewMode === 'calendar' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'calendar' ? 'white' : 'var(--text-muted)',
              fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s'
            }}
          >
            <Calendar size={16} /> Calendar
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
        {ITINERARY.map((stop) => (
          <section key={stop.city} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ 
                width: 56, 
                height: 56, 
                borderRadius: 16, 
                background: 'var(--primary-container)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--primary)',
                border: '1px solid rgba(26, 111, 205, 0.2)'
              }}>
                <MapPin size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>{stop.city}</h2>
                <p style={{ fontSize: 12, color: 'var(--accent-light)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stop.country}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {stop.days.map((day) => (
                <div key={day.day} className="glass-panel" style={{ padding: 32, borderRadius: 32, display: 'flex', gap: 40, border: '1px solid var(--outline-variant)' }}>
                  <div style={{ minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--outline-variant)', paddingRight: 40 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{day.day}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{day.date}</div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {day.activities.map((act, i) => (
                      <div key={i} className="booking-item" style={{ padding: '16px 24px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ minWidth: 90, fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{act.time}</div>
                        <div style={{ flex: 1, fontSize: 16, fontWeight: 700, color: 'white' }}>{act.name}</div>
                        <div style={{ display: 'flex', gap: 20 }}>
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                            <Clock size={14} opacity={0.6} /> {act.duration}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--accent-light)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CreditCard size={14} opacity={0.6} /> {act.cost}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

