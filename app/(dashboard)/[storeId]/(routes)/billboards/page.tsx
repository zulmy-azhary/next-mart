import type { Metadata } from "next";
import { BillboardsSection } from "./_components/billboards-section";
import type { Params } from "@/types";
import { db } from "@/lib/db";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Billboards",
};

type BillboardsPageProps = Params<{ storeId: string }>;

export default async function BillboardsPage({ params }: BillboardsPageProps) {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards = billboards.map((item) => ({
    ...item,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  
  return <BillboardsSection billboards={formattedBillboards} />;
}
