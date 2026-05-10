import React from 'react';
import { notFound } from 'next/navigation';
import { getAdminAnalytics } from './actions';
import { Users, MapPin, TrendingUp, BarChart3, Globe, Activity, ArrowUp, ArrowDown } from 'lucide-react';

const S = {
  title: { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 32 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 },
  statCard: { background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "22px 24px" },
  statTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  statIcon: { width: 40, height: 40, borderRadius: 12, background: "#dce8dc", color: "#2d4a35", display: "flex", alignItems: "center", justifyContent: "center" },
  statChange: (up: boolean) => ({ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: up ? "#2d4a35" : "#e56040" }),
  statValue: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: "#1a1a1a", marginBottom: 2 },
  statLabel: { fontSize: 11, color: "#888" },
  mainGrid: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 28 },
  card: { background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "24px" },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 },
  cityRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f5f3ef" },
  cityRank: { width: 24, height: 24, borderRadius: 7, background: "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#888", flexShrink: 0 },
  cityName: { fontSize: 14, fontWeight: 600, color: "#1a1a1a", flex: 1 },
  cityTrips: { fontSize: 12, color: "#888", minWidth: 60, textAlign: "right" as const },
  cityBar: { width: 80, height: 6, background: "#ede9e3", borderRadius: 9999, overflow: "hidden" as const },
  cityFill: (pct: number) => ({ height: "100%", width: `${pct}%`, background: "#2d4a35", borderRadius: 9999 }),
  actRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f3ef" },
  actName: { fontSize: 14, fontWeight: 600, color: "#1a1a1a" },
  actCount: { fontSize: 13, fontWeight: 700, color: "#2d4a35" },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: { textAlign: "left" as const, fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "10px 14px", borderBottom: "1px solid #e8e4de" },
  td: { padding: "12px 14px", fontSize: 14, color: "#555", borderBottom: "1px solid #f5f3ef" },
  tdName: { fontWeight: 600, color: "#1a1a1a" },
  badge: { display: "inline-block", fontSize: 11, fontWeight: 600, borderRadius: 9999, padding: "3px 10px", background: "#dce8dc", color: "#2d4a35" },
};

const ICONS = [<Users key="u" size={18}/>, <MapPin key="m" size={18}/>, <Activity key="a" size={18}/>, <TrendingUp key="t" size={18}/>];

export default async function AdminPage() {
  const data = await getAdminAnalytics();

  if (!data) {
    notFound();
  }

  return (
    <div>
      <h1 style={S.title}>Analytics Dashboard</h1>
      <p style={S.subtitle}>Monitor platform usage, popular destinations, and user engagement.</p>

      {/* Stats */}
      <div style={S.statsGrid}>
        {data.stats.map((stat, i) => (
          <div key={stat.label} style={S.statCard}>
            <div style={S.statTop}>
              <div style={S.statIcon}>{ICONS[i]}</div>
              <div style={S.statChange(stat.up)}>
                {stat.up ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
                {stat.change}
              </div>
            </div>
            <div style={S.statValue}>{stat.value}</div>
            <div style={S.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Cities & Activities */}
      <div style={S.mainGrid}>
        <div style={S.card}>
          <div style={S.cardTitle}><Globe size={16} /> Top Cities</div>
          {data.topCities.map((city) => (
            <div key={city.name} style={S.cityRow}>
              <div style={S.cityRank}>{city.rank}</div>
              <div style={S.cityName}>{city.name}</div>
              <div style={S.cityTrips}>{city.trips.toLocaleString()}</div>
              <div style={S.cityBar}><div style={S.cityFill(city.pct)} /></div>
            </div>
          ))}
          {data.topCities.length === 0 && <p style={{ fontSize: 13, color: "#888", textAlign: "center", padding: 20 }}>No destination data yet.</p>}
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}><BarChart3 size={16} /> Popular Activities</div>
          {data.topActivities.map((act) => (
            <div key={act.name} style={S.actRow}>
              <div style={S.actName}>{act.name}</div>
              <div style={S.actCount}>{act.count.toLocaleString()}</div>
            </div>
          ))}
          {data.topActivities.length === 0 && <p style={{ fontSize: 13, color: "#888", textAlign: "center", padding: 20 }}>No activity data yet.</p>}
        </div>
      </div>

      {/* User Table */}
      <div style={S.card}>
        <div style={S.cardTitle}><Users size={16} /> Recent Users</div>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Name</th>
              <th style={S.th}>Email</th>
              <th style={S.th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {data.recentUsers.map((user) => (
              <tr key={user.email}>
                <td style={{ ...S.td, ...S.tdName }}>{user.name}</td>
                <td style={S.td}>{user.email}</td>
                <td style={S.td}>{user.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
