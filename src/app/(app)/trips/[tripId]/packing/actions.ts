"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResult, PackingItem } from "@/types";

/**
 * Add a new item to the packing list
 */
export async function addPackingItem(
  tripId: string,
  formData: FormData
): Promise<ActionResult> {
  const itemName = formData.get("item_name") as string;
  const category = (formData.get("category") as string) || "General";

  if (!itemName) {
    return { success: false, error: "Item name is required" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("packing_items")
    .insert({
      trip_id: tripId,
      item_name: itemName,
      category,
      is_packed: false,
    });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/trips/${tripId}/packing`);
  return { success: true };
}

/**
 * Get all packing items for a trip
 */
export async function getPackingItems(tripId: string): Promise<PackingItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("packing_items")
    .select("*")
    .eq("trip_id", tripId)
    .is("deleted_at", null)
    .order("category", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching packing items:", error);
    return [];
  }

  return data || [];
}

/**
 * Toggle the packed status of an item
 */
export async function togglePackingItem(
  tripId: string,
  itemId: string,
  isPacked: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("packing_items")
    .update({ is_packed: isPacked })
    .eq("id", itemId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/trips/${tripId}/packing`);
  return { success: true };
}

/**
 * Remove an item from the packing list
 */
export async function removePackingItem(
  tripId: string,
  itemId: string
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("packing_items")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", itemId);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/trips/${tripId}/packing`);
  return { success: true };
}
