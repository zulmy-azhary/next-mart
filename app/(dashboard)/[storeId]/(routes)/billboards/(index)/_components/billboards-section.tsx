"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoAddOutline } from "react-icons/io5";
import { type BillboardColumn, columns } from "./columns";

type BillboardsSectionProps = {
  billboards: BillboardColumn[];
};

export const BillboardsSection: React.FC<BillboardsSectionProps> = ({ billboards }) => {
  const { storeId } = useParams<{ storeId: string }>();

  return (
    <Section>
      <SectionHeader>
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Manage billboards for your store"
        />
        <Button variant="primary" asChild>
          <Link href={`/${storeId}/billboards/create`}>
            <IoAddOutline className="mr-2 size-4" />
            Add Billboard
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <DataTable searchKey="label" columns={columns} data={billboards} />
      </SectionContent>
    </Section>
  );
};
