import type { Metadata } from "next";
import { CategoriesSection } from "./_components/categories-section";
import type { Params } from "@/types";
import { db } from "@/lib/db";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Categories",
};

type CategoriesPageProps = Params<{ storeId: string }>;

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { storeId } = params;

  const categories = await db.category.findMany({
    where: {
      storeId,
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards = categories.map((category) => ({
    ...category,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, "MMMM do, yyyy"),
  }));
  
  return <CategoriesSection billboards={formattedBillboards} />;
}
