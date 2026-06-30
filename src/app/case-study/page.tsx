import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/CaseStudyPage";

export const metadata: Metadata = {
  title: "Noirtable Journal | Restaurant Website",
  description:
    "Build notes for Noirtable: menu, reservations, checkout, and the staff list.",
};

export default function CaseStudy() {
  return <CaseStudyPage />;
}
