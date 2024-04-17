import { db } from "@/lib/db";
import type { Params } from "@/types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import { EditProductForm } from "./_components/edit-product-form";

export const metadata: Metadata = {
  title: "Edit Product",
};

type EditProductPageProps = Params<{ storeId: string; id: string }>;

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { storeId, id } = params;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!product) {
    redirect(`/${storeId}/products`);
  }

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
        <Heading title="Edit Product" description="Edit an existing product" />
        <Button asChild>
          <Link href={`/${storeId}/products`}>
            <IoArrowBackOutline className="mr-2 size-4" />
            Back
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <EditProductForm
          data={{ product: JSON.parse(JSON.stringify(product)), categories, sizes, colors }}
        />
      </SectionContent>
    </Section>
  );
}
