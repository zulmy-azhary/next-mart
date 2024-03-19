"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoAddOutline } from "react-icons/io5";
import { type CategoryColumn, columns } from "./columns";

type CategoriesSectionProps = {
  billboards: CategoryColumn[];
};

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ billboards }) => {
  const { storeId } = useParams<{ storeId: string }>();

  return (
    <Section>
      <SectionHeader>
        <Heading
          title={`Categories (${billboards.length})`}
          description="Manage categories for your store"
        />
        <Button variant="primary" asChild>
          <Link href={`/${storeId}/categories/create`}>
            <IoAddOutline className="mr-2 size-4" />
            Add Category
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <DataTable searchKey="name" columns={columns} data={billboards} />
      </SectionContent>
    </Section>
  );
};
