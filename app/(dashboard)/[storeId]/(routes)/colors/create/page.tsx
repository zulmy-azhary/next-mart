import type { Params } from "@/types";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { CreateColorForm } from "./_components/create-color-form";

export const metadata: Metadata = {
  title: "Create Color",
};

type CreateColorPageProps = Params<{ storeId: string }>;

export default function CreateColorPage({ params }: CreateColorPageProps) {
  const { storeId } = params;
  
  return (
    <Section>
      <SectionHeader>
        <Heading title="Create Color" description="Add a new color" />
        <Button asChild>
          <Link href={`/${storeId}/colors`}>
            <IoArrowBackOutline className="mr-2 size-4" />
            Back
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <CreateColorForm />
      </SectionContent>
    </Section>
  );
}
