import type { Metadata } from "next";
import { CreateBillboardForm } from "./_components/create-billboard-form";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import type { Params } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Create Billboard",
};

type CreateBillboardPageProps = Params<{ storeId: string }>;

export default async function CreateBillboardPage({ params }: CreateBillboardPageProps) {
  const { storeId } = params;

  return (
    <Section>
      <SectionHeader>
        <Heading title="Create Billboard" description="Add a new billboard" />
        <Button asChild>
          <Link href={`/${storeId}/billboards`}>
            <IoArrowBackOutline className="mr-2 size-4" />
            Back
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <CreateBillboardForm />
      </SectionContent>
    </Section>
  );
}
