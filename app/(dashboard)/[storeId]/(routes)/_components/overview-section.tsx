import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";

export const OverviewSection: React.FC = () => {
  return (
    <Section>
      <SectionHeader>
        <Heading title="Overview" description="Overview of your store" />
      </SectionHeader>
      <Separator />
      <SectionContent>Overview Section</SectionContent>
    </Section>
  );
};
