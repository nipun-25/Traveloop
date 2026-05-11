import React from 'react';
import Link from 'next/link';
import { getBudgetBreakdown } from './actions';
import { ArrowLeft, Wallet, PieChart, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default async function BudgetPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const data = await getBudgetBreakdown(tripId);

  // Calculate totals from real data
  const allActivities = data.flatMap((stop: any) => stop.activities || []);
  const totalSpent = allActivities.reduce((sum: number, a: any) => sum + (a.custom_cost || 0), 0);

  // Group by category
  const categoryMap: Record<string, number> = {};
  allActivities.forEach((a: any) => {
    const cat = a.activity?.category || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + (a.custom_cost || 0);
  });
  const categories = Object.entries(categoryMap).map(([name, total]) => ({
    name,
    total,
    pct: totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0,
  })).sort((a, b) => b.total - a.total);

  // Group by stop
  const stopBreakdown = data.map((stop: any) => ({
    city: stop.city?.name || "Unknown",
    total: (stop.activities || []).reduce((s: number, a: any) => s + (a.custom_cost || 0), 0),
    count: (stop.activities || []).length,
  })).filter((s: any) => s.total > 0);

  const colors = ["var(--primary)", "var(--accent-light)", "var(--gold)", "#10b981", "#8b5cf6", "#ec4899"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, fontFamily: "'Montserrat', sans-serif" }}>
      <header>
        <Link href={`/trips/${tripId}`} style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 8, 
          color: "var(--text-muted)", 
          fontSize: 13, 
          fontWeight: 700, 
          textDecoration: "none", 
          marginBottom: 16,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <ArrowLeft size={16} /> Back to Trip
        </Link>
        <h1 style={{ fontSize: 32, color: "white", marginBottom: 8, letterSpacing: "-0.02em" }}>Budget & Costs</h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 500 }}>Track your spending across all stops and categories.</p>
      </header>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
        <div className="glass-panel" style={{ padding: 28, borderRadius: 24, border: '1px solid var(--outline-variant)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(26, 111, 205, 0.1)',
              color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(26, 111, 205, 0.2)'
            }}>
              <DollarSign size={22} />
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Total Spent</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>${totalSpent.toLocaleString()}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, fontWeight: 500 }}>{allActivities.length} expenses tracked</div>
        </div>

        <div className="glass-panel" style={{ padding: 28, borderRadius: 24, border: '1px solid var(--outline-variant)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(245, 166, 35, 0.1)',
              color: 'var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(245, 166, 35, 0.2)'
            }}>
              <Activity size={22} />
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Categories</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{categories.length}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, fontWeight: 500 }}>Expense types listed</div>
        </div>
      </div>

      {totalSpent === 0 ? (
        <div className="glass-panel" style={{ padding: 64, borderRadius: 32, textAlign: "center", border: "1px dashed var(--outline-variant)" }}>
          <p style={{ color: "var(--text-muted)", fontSize: 16, fontWeight: 500 }}>
            No expenses recorded yet. Add activities with costs to your itinerary stops to see the breakdown here.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
          {/* Category Breakdown */}
          <div className="glass-panel" style={{ padding: 32, borderRadius: 28, border: '1px solid var(--outline-variant)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
              <PieChart size={18} color="var(--primary)" /> Cost by Category
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {categories.map((cat, i) => (
                <div key={cat.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors[i % colors.length] }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{cat.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{cat.pct}% of total</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>${cat.total.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* By Stop */}
          <div className="glass-panel" style={{ padding: 32, borderRadius: 28, border: '1px solid var(--outline-variant)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
              <TrendingUp size={18} color="var(--gold)" /> Cost by Destination
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {stopBreakdown.map((stop: any, i: number) => (
                <div key={stop.city} style={{ padding: "0 4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{stop.city}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "var(--gold)" }}>${stop.total.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ 
                      height: "100%", 
                      width: `${totalSpent > 0 ? Math.round((stop.total / totalSpent) * 100) : 0}%`, 
                      background: `linear-gradient(90deg, ${colors[i % colors.length]}, var(--primary))`, 
                      borderRadius: 10 
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
