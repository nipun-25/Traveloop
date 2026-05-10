"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResult, TripStopActivity } from "@/types";

/**
 * Add an activity (expense) to a trip stop
 */
export async function addActivityExpense(
  tripId: string,
  stopId: string,
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const cost = parseFloat(formData.get("cost") as string);
  const notes = formData.get("notes") as string;

  if (!name || isNaN(cost)) {
    return { success: false, error: "Name and cost are required" };
  }

  const supabase = await createClient();

  // 1. Create or Find activity in catalog
  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .insert({ name, category, estimated_cost: cost })
    .select()
    .single();

  if (activityError) return { success: false, error: activityError.message };

  // 2. Link to the trip stop
  const { error: linkError } = await supabase
    .from("trip_stop_activities")
    .insert({
      trip_stop_id: stopId,
      activity_id: activity.id,
      custom_cost: cost,
      notes,
    });

  if (linkError) return { success: false, error: linkError.message };

  revalidatePath(`/trips/${tripId}/budget`);
  revalidatePath(`/trips/${tripId}/itinerary`);
  return { success: true };
}

/**
 * Get budget breakdown for a trip
 */
export async function getBudgetBreakdown(tripId: string) {
  const supabase = await createClient();

  // Fetch stops with their activities
  const { data, error } = await supabase
    .from("trip_stops")
    .select(`
      id,
      city:cities(name),
      activities:trip_stop_activities(
        id,
        custom_cost,
        notes,
        activity:activities(name, category)
      )
    `)
    .eq("trip_id", tripId)
    .is("deleted_at", null)
    .order("stop_order", { ascending: true });

  if (error) {
    console.error("Error fetching budget breakdown:", error);
    return [];
  }

  return data || [];
}

/**
 * Remove an activity/expense
 */
export async function removeExpense(tripId: string, activityId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("trip_stop_activities")
    .delete()
    .eq("id", activityId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/trips/${tripId}/budget`);
  return { success: true };
}
