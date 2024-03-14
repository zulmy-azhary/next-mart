"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import type { Billboard } from "@prisma/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoAddOutline } from "react-icons/io5";

type BillboardsSectionProps = {
  billboards: Billboard[];
};

export const BillboardsSection: React.FC<BillboardsSectionProps> = ({ billboards }) => {
  const { storeId } = useParams<{ storeId: string }>();

  return (
    <Section>
      <SectionHeader>
        <Heading title={`Billboards (${billboards.length})`} description="Manage billboards for your store" />
        <Button variant="primary" asChild>
          <Link href={`/${storeId}/billboards/create`}>
            {" "}
            <IoAddOutline className="mr-2 size-4" />
            Add Billboard
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        This is billboards page.
      </SectionContent>
    </Section>
  );
};
