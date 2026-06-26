import type { Metadata } from "next";
import { FullMenuPage } from "@/components/FullMenuPage";

export const metadata: Metadata = {
  title: "Menu | Noirtable",
  description:
    "A full editorial restaurant menu for Noirtable with ordering and reservations.",
};

export default function Menu() {
  return <FullMenuPage />;
}
