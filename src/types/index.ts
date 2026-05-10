// ============================================================
// Traveloop V1 — Core Type Definitions
// ============================================================

// --- Profiles ---
export interface Profile {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
  language_preference: string;
  created_at: string;
  updated_at: string;
}

// --- Trips ---
export interface Trip {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  cover_photo_url: string | null;
  is_public: boolean;
  share_slug: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TripFormData {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

export interface TripWithStops extends Trip {
  trip_stops: TripStopWithCity[];
}

// --- Cities ---
export interface City {
  id: string;
  name: string;
  country: string;
  region: string | null;
  cost_index: number | null;
  popularity_score: number | null;
  created_at: string;
  updated_at: string;
}

// --- Trip Stops ---
export interface TripStop {
  id: string;
  trip_id: string;
  city_id: string;
  stop_order: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  city?: City;
}


export interface TripStopWithCity extends TripStop {
  cities: City;
}

export interface TripStopWithActivities extends TripStopWithCity {
  trip_stop_activities: TripStopActivityWithDetails[];
}

export interface TripStopFormData {
  city_id: string;
  start_date: string;
  end_date: string;
}

// --- Activities ---
export interface Activity {
  id: string;
  city_id: string | null;
  name: string;
  category: string;
  estimated_cost: number;
  duration_minutes: number | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ActivityCategory =
  | "Sightseeing"
  | "Food & Dining"
  | "Adventure"
  | "Culture"
  | "Shopping"
  | "Nightlife"
  | "Relaxation"
  | "Transportation"
  | "Accommodation"
  | "Other";

// --- Trip Stop Activities (join table) ---
export interface TripStopActivity {
  id: string;
  trip_stop_id: string;
  activity_id: string;
  activity_date: string | null;
  activity_time: string | null;
  custom_cost: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TripStopActivityWithDetails extends TripStopActivity {
  activities: Activity;
}

// --- Packing Items ---
export interface PackingItem {
  id: string;
  trip_id: string;
  item_name: string;
  category: string;
  is_packed: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type PackingCategory =
  | "Clothing"
  | "Toiletries"
  | "Electronics"
  | "Documents"
  | "Medicine"
  | "Accessories"
  | "Other";

export interface PackingItemFormData {
  item_name: string;
  category: string;
}

// --- Trip Notes ---
export interface TripNote {
  id: string;
  trip_id: string;
  trip_stop_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TripNoteFormData {
  content: string;
  trip_stop_id?: string;
}

// --- Share Links ---
export interface ShareLink {
  id: string;
  trip_id: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
  revoked_at: string | null;
}

// --- Budget ---
export interface BudgetSummary {
  total_cost: number;
  category_breakdown: CategoryCost[];
  daily_costs: DailyCost[];
}

export interface CategoryCost {
  category: string;
  total: number;
  percentage: number;
}

export interface DailyCost {
  date: string;
  total: number;
  activities: {
    name: string;
    cost: number;
  }[];
}

// --- API / Action Responses ---
export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
