"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoAddOutline } from "react-icons/io5";
import { type ColorColumn, columns } from "./columns";

type ColorsSectionProps = {
  colors: ColorColumn[];
};

export const ColorsSection: React.FC<ColorsSectionProps> = ({ colors }) => {
  const { storeId } = useParams<{ storeId: string }>();

  return (
    <Section>
      <SectionHeader>
        <Heading title={`Colors (${colors.length})`} description="Manage colors for your store" />
        <Button variant="primary" asChild>
          <Link href={`/${storeId}/colors/create`}>
            <IoAddOutline className="mr-2 size-4" />
            Add Color
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <DataTable searchKey="name" columns={columns} data={colors} />
      </SectionContent>
    </Section>
  );
};
