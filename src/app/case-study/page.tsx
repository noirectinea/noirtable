import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/CaseStudyPage";

export const metadata: Metadata = {
  title: "Noirtable Case Study | Restaurant Website",
  description:
    "A restaurant website case study with menu, cart, checkout, reservations, and staff desk.",
};

export default function CaseStudy() {
  return <CaseStudyPage />;
}
