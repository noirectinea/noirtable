import { menuItems as localMenuItems, type MenuItem, type MenuCategory } from "@/data/menu";
import { getSupabaseClient } from "@/lib/supabase/client";

type MenuItemRow = {
  id: number;
  name: string;
  category: MenuCategory;
  description: string;
  price: number | string;
  prep_time: string;
  badge: string | null;
  image: string | null;
};

type MenuItemsResult = {
  items: MenuItem[];
  error: string | null;
  source: "supabase" | "local";
};

function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    price: Number(row.price),
    prepTime: row.prep_time,
    badge: row.badge ?? undefined,
    image: row.image ?? undefined,
  };
}

export async function getMenuItemsForMenu(): Promise<MenuItemsResult> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      items: localMenuItems,
      error: "Supabase env is not configured yet.",
      source: "local",
    };
  }

  const { data, error } = await supabase
    .from("menu_items")
    .select("id,name,category,description,price,prep_time,badge,image")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return {
      items: localMenuItems,
      error: error?.message ?? "Supabase returned no menu items.",
      source: "local",
    };
  }

  return {
    items: data.map((row) => toMenuItem(row as MenuItemRow)),
    error: null,
    source: "supabase",
  };
}
