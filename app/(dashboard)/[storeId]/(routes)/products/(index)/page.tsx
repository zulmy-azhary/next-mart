import type { Params } from "@/types";
import type { Metadata } from "next";
import { ProductsSection } from "./_components/product-section";
import { db } from "@/lib/db";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Products",
};

type ProductsPageProps = Params<{ storeId: string }>;

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { storeId } = params;

  const products = await db.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts = products.map((product) => ({
    ...product,
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    price: formatter.format(product.price.toNumber()),
    createdAt: format(product.createdAt, "MMMM do, yyyy"),
  }));

  return <ProductsSection products={formattedProducts} />;
}
