import { type MenuCategory, type MenuItem } from "@/data/menu";
import { getSupabaseClient } from "@/lib/supabase/client";

export type StaffMenuItem = MenuItem & {
  active: boolean;
  sortOrder: number;
};

export type MenuItemInput = {
  id?: number;
  name?: string;
  category?: MenuCategory;
  description?: string;
  price?: number;
  prepTime?: string;
  badge?: string;
  image?: string;
  active?: boolean;
};

type MenuItemRow = {
  id: number;
  sort_order: number;
  name: string;
  category: MenuCategory;
  description: string;
  price: number | string;
  prep_time: string;
  badge: string | null;
  image: string | null;
  active: boolean;
};

const fallbackImage = "/images/generated-dishes-fast/pasta.jpg";

function toStaffMenuItem(row: MenuItemRow): StaffMenuItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    price: Number(row.price),
    prepTime: row.prep_time,
    badge: row.badge ?? undefined,
    image: row.image ?? undefined,
    active: row.active,
    sortOrder: row.sort_order,
  };
}

export async function listStaffMenuItems(accessToken: string) {
  const supabase = getSupabaseClient(accessToken);

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("id,sort_order,name,category,description,price,prep_time,badge,image,active")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((row) => toStaffMenuItem(row as MenuItemRow));
}

export async function updateStaffMenuItem(
  input: MenuItemInput,
  accessToken: string,
) {
  if (!input.id) {
    throw new Error("Menu item id is required.");
  }

  const supabase = getSupabaseClient(accessToken);

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const updatePayload: Record<string, string | number | boolean | null> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    updatePayload.name = input.name.trim();
  }
  if (input.category !== undefined) {
    updatePayload.category = input.category;
  }
  if (input.description !== undefined) {
    updatePayload.description = input.description.trim();
  }
  if (input.price !== undefined) {
    updatePayload.price = input.price;
  }
  if (input.prepTime !== undefined) {
    updatePayload.prep_time = input.prepTime.trim();
  }
  if (input.badge !== undefined) {
    updatePayload.badge = input.badge.trim() || null;
  }
  if (input.image !== undefined) {
    updatePayload.image = input.image.trim() || fallbackImage;
  }
  if (input.active !== undefined) {
    updatePayload.active = input.active;
  }

  const { data, error } = await supabase
    .from("menu_items")
    .update(updatePayload)
    .eq("id", input.id)
    .select("id,sort_order,name,category,description,price,prep_time,badge,image,active")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Menu item not found.");
  }

  return toStaffMenuItem(data as MenuItemRow);
}

export async function createStaffMenuItem(
  input: MenuItemInput,
  accessToken: string,
) {
  if (!input.name?.trim() || !input.category || !input.price) {
    throw new Error("Name, category, and price are required.");
  }

  const supabase = getSupabaseClient(accessToken);

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data: latestItem } = await supabase
    .from("menu_items")
    .select("id,sort_order")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextId = Number(latestItem?.id ?? 100) + 1;
  const nextSortOrder = Number(latestItem?.sort_order ?? nextId) + 1;

  const { data, error } = await supabase
    .from("menu_items")
    .insert({
      id: nextId,
      sort_order: nextSortOrder,
      name: input.name.trim(),
      category: input.category,
      description: input.description?.trim() || "Added from the staff desk.",
      price: input.price,
      prep_time: input.prepTime?.trim() || "15 min",
      badge: input.badge?.trim() || null,
      image: input.image?.trim() || fallbackImage,
      active: input.active ?? true,
    })
    .select("id,sort_order,name,category,description,price,prep_time,badge,image,active")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create menu item.");
  }

  return toStaffMenuItem(data as MenuItemRow);
}
