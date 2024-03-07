import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  return (
    <Section>
      <SectionHeader>
        <Heading title="Overview" description="Overview of your store" />
      </SectionHeader>
      <Separator />
      <SectionContent>
        This is overview page.
      </SectionContent>
    </Section>
  );
}
