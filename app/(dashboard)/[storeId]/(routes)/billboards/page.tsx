import type { Metadata } from "next";
import { BillboardsSection } from "./components/billboards-section";
import type { Params } from "@/types";
import { db } from "@/lib/db";

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
  
  return <BillboardsSection billboards={billboards} />;
}
