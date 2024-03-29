"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoAddOutline } from "react-icons/io5";
import { type SizeColumn, columns } from "./columns";

type SizesSectionProps = {
  sizes: SizeColumn[];
};

export const SizesSection: React.FC<SizesSectionProps> = ({ sizes }) => {
  const { storeId } = useParams<{ storeId: string }>();

  return (
    <Section>
      <SectionHeader>
        <Heading title={`Sizes (${sizes.length})`} description="Manage sizes for your store" />
        <Button variant="primary" asChild>
          <Link href={`/${storeId}/sizes/create`}>
            <IoAddOutline className="mr-2 size-4" />
            Add Size
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <DataTable searchKey="name" columns={columns} data={sizes} />
      </SectionContent>
    </Section>
  );
};
