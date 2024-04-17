"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IoAddOutline } from "react-icons/io5";
import { type ProductColumn, columns } from "./columns";

type ProductsSectionProps = {
  products: ProductColumn[];
};

export const ProductsSection: React.FC<ProductsSectionProps> = ({ products }) => {
  const { storeId } = useParams<{ storeId: string }>();

  return (
    <Section>
      <SectionHeader>
        <Heading
          title={`Products (${products.length})`}
          description="Manage products for your store"
        />
        <Button variant="primary" asChild>
          <Link href={`/${storeId}/products/create`}>
            <IoAddOutline className="mr-2 size-4" />
            Add Product
          </Link>
        </Button>
      </SectionHeader>
      <Separator />
      <SectionContent>
        <DataTable searchKey="name" columns={columns} data={products} />
      </SectionContent>
    </Section>
  );
};
