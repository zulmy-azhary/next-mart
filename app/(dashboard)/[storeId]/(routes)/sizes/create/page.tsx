import type { Params } from "@/types";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { CreateSizeForm } from "./_components/create-size-form";

export const metadata: Metadata = {
  title: "Create Size",
};

type CreateSizePageProps = Params<{ storeId: string }>;

export default function CreateSizePage({ params }: CreateSizePageProps) {
  const { storeId } = params;
  
  return (
    <Section>
      <SectionHeader>
        <Heading title="Create Size" description="Add a new size" />
        <Button asChild>
          <Link href={`/${storeId}/sizes`}>
            <IoArrowBackOutline className="mr-2 size-4" />
            Back
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <CreateSizeForm />
      </SectionContent>
    </Section>
  );
}
