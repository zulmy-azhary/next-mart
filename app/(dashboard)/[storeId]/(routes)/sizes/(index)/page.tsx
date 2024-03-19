import type { Params } from "@/types";
import type { Metadata } from "next";
import { SizesSection } from "./_components/sizes-section";
import { db } from "@/lib/db";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Sizes",
};

type SizesPageProps = Params<{ storeId: string }>;

export default async function SizesPage({ params }: SizesPageProps) {
  const { storeId } = params;

  const sizes = await db.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes = sizes.map((size) => ({
    ...size,
    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }));

  return <SizesSection sizes={formattedSizes} />;
}
