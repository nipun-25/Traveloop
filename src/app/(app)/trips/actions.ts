"use server";

import { createClient } from "@/lib/supabase/server";
import { tripSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionResult, Trip } from "@/types";

/**
 * Create a new trip
 */
export async function createTrip(formData: FormData): Promise<ActionResult<Trip>> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const coverPhoto = formData.get("cover_photo") as File | null;

  const result = tripSchema.safeParse({
    name,
    description,
    start_date,
    end_date,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Upload cover photo if provided
  let cover_photo_url: string | null = null;
  if (coverPhoto && coverPhoto.size > 0) {
    const fileExt = coverPhoto.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('trip-covers')
      .upload(fileName, coverPhoto, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    const { data: urlData } = supabase.storage
      .from('trip-covers')
      .getPublicUrl(fileName);

    cover_photo_url = urlData.publicUrl;
  }

  const { data, error } = await supabase
    .from("trips")
    .insert({
      user_id: user.id,
      name,
      description: description || null,
      start_date,
      end_date,
      cover_photo_url,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  redirect(`/trips/${data.id}`);
  return { success: true, data };
}


/**
 * Get all trips for the current user
 */
export async function getTrips(): Promise<Trip[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .is("deleted_at", null)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Error fetching trips:", error);
    return [];
  }

  return data || [];
}

/**
 * Get a single trip by ID
 */
export async function getTripById(id: string): Promise<Trip | null> {
  console.log(`[getTripById] Fetching trip with ID: ${id}`);
  
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) {
      console.error(`[getTripById] Supabase error for ID ${id}:`, {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return null;
    }

    if (!data) {
      console.warn(`[getTripById] No trip found for ID: ${id}`);
      return null;
    }

    console.log(`[getTripById] Successfully fetched trip: "${data.name}" (ID: ${data.id})`);
    return data;
  } catch (err) {
    console.error(`[getTripById] Unexpected error fetching trip ${id}:`, err);
    throw err; // Re-throw to be caught by error.tsx
  }
}

/**
 * Update an existing trip
 */
export async function updateTrip(id: string, formData: FormData): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  const result = tripSchema.safeParse({
    name,
    description,
    start_date,
    end_date,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("trips")
    .update({
      name,
      description: description || null,
      start_date,
      end_date,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/trips/${id}`);
  return { success: true };
}

/**
 * Soft delete a trip
 */
export async function deleteTrip(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("trips")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
  return { success: true };
}

/**
 * Toggle public sharing for a trip
 */
export async function togglePublicSharing(
  id: string,
  isPublic: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  // If making public and slug doesn't exist, generate one
  let share_slug = null;
  if (isPublic) {
    const { data } = await supabase
      .from("trips")
      .select("share_slug")
      .eq("id", id)
      .single();
    
    if (!data?.share_slug) {
      share_slug = Math.random().toString(36).substring(2, 12);
    }
  }

  const updateData: any = { is_public: isPublic };
  if (share_slug) updateData.share_slug = share_slug;

  const { error } = await supabase
    .from("trips")
    .update(updateData)
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/trips/${id}`);
  return { success: true };
}

/**
 * Update/Regenerate share slug
 */
export async function regenerateShareSlug(id: string): Promise<ActionResult<string>> {
  const supabase = await createClient();
  const newSlug = Math.random().toString(36).substring(2, 12);

  const { error } = await supabase
    .from("trips")
    .update({ share_slug: newSlug })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/trips/${id}`);
  return { success: true, data: newSlug };
}

/**
 * Get public trip data by slug
 */
export async function getPublicTripBySlug(slug: string) {
  const supabase = await createClient();

  const { data: trip, error } = await supabase
    .from("trips")
    .select(`
      *,
      stops:trip_stops(
        *,
        city:cities(*)
      ),
      notes:trip_notes(*)
    `)
    .eq("share_slug", slug)
    .eq("is_public", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !trip) return null;

  return trip;
}
