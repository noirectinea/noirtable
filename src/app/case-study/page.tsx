import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/CaseStudyPage";

export const metadata: Metadata = {
  title: "Noirtable Case Study | Restaurant Website",
  description:
    "A premium restaurant website case study with ordering, reservations, checkout, and staff desk.",
};

export default function CaseStudy() {
  return <CaseStudyPage />;
}
