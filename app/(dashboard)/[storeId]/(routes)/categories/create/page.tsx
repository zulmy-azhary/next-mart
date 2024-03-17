import type { Metadata } from "next";
import { CreateCategoryForm } from "./_components/create-category-form";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import type { Params } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Create Category",
};

type CreateCategoryPageProps = Params<{ storeId: string }>;

export default async function CreateCategoryPage({ params }: CreateCategoryPageProps) {
  const { storeId } = params;

  const billboards = await db.billboard.findMany({
    where: {
      storeId,
    },
  });

  return (
    <Section>
      <SectionHeader>
        <Heading title="Create Category" description="Add a new category" />
        <Button asChild>
          <Link href={`/${storeId}/categories`}>
            <IoArrowBackOutline className="mr-2 size-4" />
            Back
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <CreateCategoryForm billboards={billboards} />
      </SectionContent>
    </Section>
  );
}
