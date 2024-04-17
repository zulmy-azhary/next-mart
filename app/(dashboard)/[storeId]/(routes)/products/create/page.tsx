import type { Params } from "@/types";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { CreateProductForm } from "./_components/create-product-form";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Create Product",
};

type CreateProductPageProps = Params<{ storeId: string }>;

export default async function CreateProductPage({ params }: CreateProductPageProps) {
  const { storeId } = params;

  const categories = await db.category.findMany({
    where: { storeId },
  });

  const sizes = await db.size.findMany({
    where: { storeId },
  });

  const colors = await db.color.findMany({
    where: { storeId },
  });

  return (
    <Section>
      <SectionHeader>
        <Heading title="Create Product" description="Add a new product" />
        <Button asChild>
          <Link href={`/${storeId}/products`}>
            <IoArrowBackOutline className="mr-2 size-4" />
            Back
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <CreateProductForm data={{ categories, sizes, colors }} />
      </SectionContent>
    </Section>
  );
}
