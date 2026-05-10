"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResult, TripNote } from "@/types";

/**
 * Save or update trip notes
 */
export async function saveNotes(
  tripId: string,
  content: string
): Promise<ActionResult> {
  const supabase = await createClient();

  // Upsert notes for the trip
  // We'll check if a general note exists first (trip_stop_id is null)
  const { data: existing } = await supabase
    .from("trip_notes")
    .select("id")
    .eq("trip_id", tripId)
    .is("trip_stop_id", null)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("trip_notes")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("trip_notes")
      .insert({
        trip_id: tripId,
        content,
      });
    
    if (error) return { success: false, error: error.message };
  }

  revalidatePath(`/trips/${tripId}/notes`);
  return { success: true };
}

/**
 * Get notes for a trip
 */
export async function getNotes(tripId: string): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trip_notes")
    .select("content")
    .eq("trip_id", tripId)
    .is("trip_stop_id", null)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    console.error("Error fetching notes:", error);
    return "";
  }

  return data?.content || "";
}
