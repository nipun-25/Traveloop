"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAdminAnalytics() {
  const supabase = await createClient();

  // Check if current user is admin (email check)
  const { data: { user } } = await supabase.auth.getUser();
  const ADMIN_EMAIL = "admin@traveloop.com"; // HARDCODED ADMIN EMAIL

  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  // 1. Total Users
  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // 2. Total Trips
  const { count: tripCount } = await supabase
    .from("trips")
    .select("*", { count: "exact", head: true });

  // 3. Top Cities
  const { data: cityData } = await supabase
    .from("trip_stops")
    .select(`
      city:cities(name, country)
    `);

  const cityMap: Record<string, { trips: number; name: string }> = {};
  cityData?.forEach((stop: any) => {
    const key = `${stop.city.name}, ${stop.city.country}`;
    if (!cityMap[key]) cityMap[key] = { trips: 0, name: key };
    cityMap[key].trips++;
  });

  const topCities = Object.values(cityMap)
    .sort((a, b) => b.trips - a.trips)
    .slice(0, 6)
    .map((c, i) => ({
      rank: i + 1,
      name: c.name,
      trips: c.trips,
      pct: Math.round((c.trips / (tripCount || 1)) * 100)
    }));

  // 4. Popular Activities
  const { data: actData } = await supabase
    .from("trip_stop_activities")
    .select(`
      activity:activities(name)
    `);

  const actMap: Record<string, number> = {};
  actData?.forEach((item: any) => {
    const name = item.activity.name;
    actMap[name] = (actMap[name] || 0) + 1;
  });

  const topActivities = Object.entries(actMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // 5. Recent Users
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("name, email, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    stats: [
      { label: "Total Users", value: userCount?.toLocaleString() || "0", change: "+0%", up: true },
      { label: "Trips Created", value: tripCount?.toLocaleString() || "0", change: "+0%", up: true },
      { label: "Active Nodes", value: cityData?.length.toLocaleString() || "0", change: "+0%", up: true },
      { label: "Total Activities", value: actData?.length.toLocaleString() || "0", change: "+0%", up: true },
    ],
    topCities,
    topActivities,
    recentUsers: recentUsers?.map(u => ({
      ...u,
      joined: new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      trips: 0 // In a real app, we'd join trips count
    })) || []
  };
}
