import type { Metadata } from "next";
import { FullMenuPage } from "@/components/FullMenuPage";
import { getMenuItemsForMenu } from "@/lib/supabase/menu-items";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu | Noirtable",
  description:
    "A full editorial restaurant menu for Noirtable with ordering and reservations.",
};

export default async function Menu() {
  const { items, error } = await getMenuItemsForMenu();

  return <FullMenuPage menuItems={items} menuDataError={error} />;
}
