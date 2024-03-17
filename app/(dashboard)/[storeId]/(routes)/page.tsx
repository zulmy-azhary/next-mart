import type { Metadata } from "next";
import { OverviewSection } from "./_components/overview-section";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  return <OverviewSection />;
}
