import type { Params } from "@/types";
import type { Metadata } from "next";
import { ColorsSection } from "./_components/colors-section";
import { db } from "@/lib/db";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Colors",
};

type ColorsPageProps = Params<{ storeId: string }>;

export default async function ColorsPage({ params }: ColorsPageProps) {
  const { storeId } = params;

  const colors = await db.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors = colors.map((size) => ({
    ...size,
    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }));

  return <ColorsSection colors={formattedColors} />;
}
