"use server";

import { createClient } from "@/lib/supabase/server";
import { tripStopSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { ActionResult, TripStop } from "@/types";

/**
 * Add a stop (city) to a trip
 */
export async function addStop(
  tripId: string,
  formData: FormData
): Promise<ActionResult<TripStop>> {
  const city_name = formData.get("city_name") as string;
  const country = formData.get("country") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  // 1. Validate dates and name
  const result = tripStopSchema.safeParse({
    city_name,
    start_date,
    end_date,
  });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const supabase = await createClient();

  // 2. Find or create city in the catalog
  let cityId;
  const { data: cityData, error: cityError } = await supabase
    .from("cities")
    .select("id")
    .eq("name", city_name)
    .eq("country", country)
    .maybeSingle();

  if (cityError) return { success: false, error: cityError.message };

  if (cityData) {
    cityId = cityData.id;
  } else {
    const { data: newCity, error: newCityError } = await supabase
      .from("cities")
      .insert({ name: city_name, country })
      .select()
      .single();
    
    if (newCityError) return { success: false, error: newCityError.message };
    cityId = newCity.id;
  }

  // 3. Get current max order
  const { data: stops } = await supabase
    .from("trip_stops")
    .select("stop_order")
    .eq("trip_id", tripId)
    .order("stop_order", { ascending: false })
    .limit(1);
  
  const nextOrder = (stops?.[0]?.stop_order ?? -1) + 1;

  // 4. Insert the stop
  const { data: stop, error: stopError } = await supabase
    .from("trip_stops")
    .insert({
      trip_id: tripId,
      city_id: cityId,
      stop_order: nextOrder,
      start_date,
      end_date,
    })
    .select(`
      *,
      city:cities(*)
    `)
    .single();

  if (stopError) return { success: false, error: stopError.message };

  revalidatePath(`/trips/${tripId}/itinerary`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true, data: stop as unknown as TripStop };
}

/**
 * Get all stops for a trip
 */
export async function getStops(tripId: string): Promise<TripStop[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trip_stops")
    .select(`
      *,
      city:cities(*)
    `)
    .eq("trip_id", tripId)
    .is("deleted_at", null)
    .order("stop_order", { ascending: true });

  if (error) {
    console.error("Error fetching stops:", error);
    return [];
  }

  return data as unknown as TripStop[];
}

/**
 * Remove a stop (soft delete)
 */
export async function removeStop(tripId: string, stopId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("trip_stops")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", stopId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/trips/${tripId}/itinerary`);
  return { success: true };
}

/**
 * Reorder stops
 */
export async function reorderStops(
  tripId: string,
  stopIds: string[]
): Promise<ActionResult> {
  const supabase = await createClient();

  const updates = stopIds.map((id, index) =>
    supabase.from("trip_stops").update({ stop_order: index }).eq("id", id)
  );

  const results = await Promise.all(updates);
  const error = results.find((r) => r.error)?.error;

  if (error) return { success: false, error: error.message };

  revalidatePath(`/trips/${tripId}/itinerary`);
  return { success: true };
}
