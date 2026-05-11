import React from 'react';
import Link from 'next/link';
import { getTrips } from '../trips/actions';
import { createClient } from '@/lib/supabase/server';
import { 
  PlusCircle, 
  Map, 
  User, 
  Settings, 
  HelpCircle, 
  Compass, 
  Star, 
  Briefcase, 
  CheckCircle2 
} from 'lucide-react';

export default async function DashboardPage() {
  const trips = await getTrips();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Traveler';

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  
  const upcomingTrips = trips.filter(t => new Date(t.start_date) >= new Date()).slice(0, 3);
  const pastTripsCount = trips.filter(t => new Date(t.end_date) < new Date()).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      
      {/* Welcome Section */}
      <section
        className="glass-panel"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 32,
          padding: 40,
          background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
          border: "1px solid var(--outline-variant)",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 36, color: "white", marginBottom: 12, letterSpacing: "-0.03em" }}>Welcome back, {userName}</h1>
          <p style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 500 }}>Here is your travel overview and upcoming plans.</p>
        </div>
        <Link
          href="/trips/create-trip"
          style={{
            padding: "16px 32px",
            background: "var(--primary)",
            color: "white",
            borderRadius: 16,
            fontWeight: 700,
            fontSize: 16,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 10px 25px rgba(26, 111, 205, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            textDecoration: 'none'
          }}
        >
          <PlusCircle size={20} />
          <span>Plan New Trip</span>
        </Link>
      </section>

      {/* Upcoming Trips */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, color: "white", letterSpacing: "-0.02em" }}>Upcoming Adventures</h2>
          <Link href="/trips" style={{ color: "var(--primary)", textDecoration: 'none', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            View all trips
            <Compass size={14} />
          </Link>
        </div>

        {upcomingTrips.length === 0 ? (
          <div className="glass-panel" style={{ padding: "80px 40px", textAlign: 'center', borderRadius: 32, border: '1px dashed var(--outline)' }}>
            <div style={{ color: 'var(--primary)', opacity: 0.5, marginBottom: 20 }}>
              <Compass size={48} />
            </div>
            <h3 style={{ fontSize: 20, color: 'white', marginBottom: 12 }}>No upcoming trips</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, maxWidth: 400, marginInline: 'auto' }}>Time to start planning your next getaway! Explore new destinations and create memories.</p>
            <Link href="/trips/create-trip" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', background: 'var(--primary-container)', padding: '12px 24px', borderRadius: 12 }}>Create a trip now</Link>
          </div>
        ) : (
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 32 }}
          >
            {upcomingTrips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`} className="dest-card" style={{ textDecoration: 'none' }}>
                <img src={trip.cover_photo_url || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80"} alt={trip.name} />
                <div className="overlay" />
                <div className="bookmark-btn">
                  <Star size={20} fill="var(--gold)" color="var(--gold)" />
                </div>
                <div className="card-info">
                  <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.05em', marginBottom: 6, textTransform: 'uppercase' }}>
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </div>
                  <h3 className="text-shadow" style={{ fontWeight: 700, fontSize: 22, color: "white" }}>
                    {trip.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Stats & Actions */}
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 32, paddingBottom: 64 }}
      >
        {/* Stats */}
        <div className="glass-panel" style={{ borderRadius: 32, padding: 32, border: '1px solid var(--outline-variant)' }}>
          <h3 style={{ fontSize: 20, color: "white", marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Briefcase size={20} color="var(--primary)" />
            Travel Stats
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { label: "Total Trips", icon: Compass, color: "var(--primary)", count: trips.length },
              { label: "Completed", icon: CheckCircle2, color: "#10b981", count: pastTripsCount },
            ].map((stat) => (
              <div key={stat.label} className="budget-card" style={{ background: 'rgba(255,255,255,0.02)', padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase" }}>{stat.label}</span>
                  <stat.icon size={18} color={stat.color} />
                </div>
                <span style={{ fontSize: 32, fontWeight: 800, color: "white" }}>{stat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel" style={{ borderRadius: 32, padding: 32, border: '1px solid var(--outline-variant)' }}>
          <h3 style={{ fontSize: 20, color: "white", marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Compass size={20} color="var(--secondary)" />
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'My Profile', icon: User, href: '/profile', color: 'var(--primary)' },
              { label: 'Explore Cities', icon: Map, href: '/trips', color: 'var(--secondary)' },
              { label: 'Settings', icon: Settings, href: '/profile', color: 'white' },
              { label: 'Help Center', icon: HelpCircle, href: '#', color: 'var(--text-muted)' },
            ].map(action => (
              <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
                <div className="booking-item" style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <action.icon size={18} color={action.color} opacity={0.8} />
                    <span style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{action.label}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

