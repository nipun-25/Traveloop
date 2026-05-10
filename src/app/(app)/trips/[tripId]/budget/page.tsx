import React from 'react';
import Link from 'next/link';
import { getBudgetBreakdown } from './actions';
import { ArrowLeft, Wallet, PieChart, TrendingUp, Plus } from 'lucide-react';

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

  const colors = ["#2d4a35", "#5b8a68", "#8cb89e", "#c5d4c5", "#d97706", "#e56040"];

  return (
    <div>
      <Link href={`/trips/${tripId}`} style={{ display: "flex", alignItems: "center", gap: 6, color: "#888", fontSize: 13, fontWeight: 500, textDecoration: "none", marginBottom: 28 }}>
        <ArrowLeft size={15} /> Back to Trip
      </Link>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Budget & Costs</h1>
          <p style={{ fontSize: 14, color: "#888" }}>Track your spending across all stops.</p>
        </div>
      </div>

      {/* Total */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "22px 24px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Total Spent</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: "#1a1a1a" }}>${totalSpent.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{allActivities.length} expenses across {data.length} stops</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "22px 24px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Categories</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: "#1a1a1a" }}>{categories.length}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Expense categories tracked</div>
        </div>
      </div>

      {totalSpent === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "2px dashed #ddd8d0", padding: "40px", textAlign: "center", color: "#888", fontSize: 14 }}>
          No expenses recorded yet. Add activities to your itinerary stops to track costs here.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Category Breakdown */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "24px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <PieChart size={16} /> Cost by Category
            </div>
            {categories.map((cat, i) => (
              <div key={cat.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0ede8" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors[i % colors.length] }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{cat.name}</div>
                    <div style={{ fontSize: 11, color: "#999" }}>{cat.pct}%</div>
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>${cat.total.toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* By Stop */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e4de", padding: "24px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={16} /> Cost by Stop
            </div>
            {stopBreakdown.map((stop: any, i: number) => (
              <div key={stop.city} style={{ padding: "12px 0", borderBottom: "1px solid #f0ede8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{stop.city}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>${stop.total.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: "#ede9e3", borderRadius: 9999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${totalSpent > 0 ? Math.round((stop.total / totalSpent) * 100) : 0}%`, background: colors[i % colors.length], borderRadius: 9999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
