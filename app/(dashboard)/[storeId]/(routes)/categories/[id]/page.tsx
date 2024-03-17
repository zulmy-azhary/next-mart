import type { Metadata } from "next";
import { EditCategoryForm } from "./_components/edit-category-form";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import type { Params } from "@/types";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Edit Category",
};

type EditCategoryPageProps = Params<{ storeId: string; id: string }>;

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { storeId, id } = params;

  const category = await db.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    redirect(`/${storeId}/categories`);
  }

  const billboards = await db.billboard.findMany({
    where: {
      storeId,
    },
  });

  return (
    <Section>
      <SectionHeader>
        <Heading title="Edit Category" description="Edit an existing category" />
        <Button asChild>
          <Link href={`/${storeId}/categories`}>
            <IoArrowBackOutline className="mr-2 size-4" />
            Back
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <EditCategoryForm category={category} billboards={billboards} />
      </SectionContent>
    </Section>
  );
}
