import React from 'react';
import { notFound } from 'next/navigation';
import { getAdminAnalytics } from './actions';
import { 
  Users, 
  Map, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Zap, 
  Search,
  BarChart3
} from 'lucide-react';

export default async function AdminPage() {
  const data = await getAdminAnalytics();

  if (!data) {
    notFound();
  }

  const STAT_ICONS = [Users, Map, Activity, TrendingUp];
  const STAT_COLORS = ["var(--primary)", "var(--accent-light)", "var(--gold)", "#10b981"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, fontFamily: "'Montserrat', sans-serif" }}>
      <header>
        <h1 style={{ fontSize: 32, color: "white", marginBottom: 8, letterSpacing: "-0.02em" }}>Analytics Dashboard</h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 500 }}>Monitor platform usage, popular destinations, and user engagement.</p>
      </header>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
        {data.stats.map((stat, i) => {
          const Icon = STAT_ICONS[i];
          return (
            <div key={stat.label} className="glass-panel" style={{ padding: 28, borderRadius: 24, border: '1px solid var(--outline-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  color: STAT_COLORS[i],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <Icon size={22} />
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, fontWeight: 700,
                  color: stat.up ? '#10b981' : 'var(--error)'
                }}>
                  {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.change}
                </div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 6, letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        {/* Top Cities */}
        <div className="glass-panel" style={{ padding: 32, borderRadius: 24, border: '1px solid var(--outline-variant)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <Globe size={18} color="var(--accent-light)" />
            Top Travel Destinations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {data.topCities.map((city) => (
              <div key={city.name} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 32, fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', opacity: 0.3 }}>{city.rank.toString().padStart(2, '0')}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>{city.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{city.trips.toLocaleString()} trips</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${city.pct}%`, 
                      background: 'linear-gradient(90deg, var(--primary), var(--accent-light))', 
                      borderRadius: 10 
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Activities */}
        <div className="glass-panel" style={{ padding: 32, borderRadius: 24, border: '1px solid var(--outline-variant)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <Zap size={18} color="var(--gold)" />
            Trending Activities
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.topActivities.map((act) => (
              <div key={act.name} style={{
                padding: '16px 20px', borderRadius: 16,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.03)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'all 0.3s'
              }}>
                <span style={{ fontWeight: 600, color: 'white', fontSize: 14 }}>{act.name}</span>
                <span className="pill-confirmed" style={{ fontSize: 11 }}>{act.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel" style={{ padding: 32, borderRadius: 24, border: '1px solid var(--outline-variant)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Search size={18} color="var(--primary)" />
          Recent Explorers
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                <th style={{ textAlign: 'left', padding: '16px', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Member</th>
                <th style={{ textAlign: 'left', padding: '16px', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Contact</th>
                <th style={{ textAlign: 'left', padding: '16px', color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.recentUsers.map((user) => (
                <tr key={user.email} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }}>
                  <td style={{ padding: '20px 16px', fontWeight: 700, color: 'white', fontSize: 14 }}>{user.name}</td>
                  <td style={{ padding: '20px 16px', color: 'var(--text-muted)', fontSize: 14, fontWeight: 500 }}>{user.email}</td>
                  <td style={{ padding: '20px 16px', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

