import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/CaseStudyPage";

export const metadata: Metadata = {
  title: "Noirtable Notes | Restaurant Website",
  description:
    "Notes on a small restaurant website with menu, reservations, checkout, and staff desk.",
};

export default function CaseStudy() {
  return <CaseStudyPage />;
}
