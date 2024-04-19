"use client";

import { Heading } from "@/components/ui/heading";
import { Section, SectionContent, SectionHeader } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { columns, OrderColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";

type OrdersSectionProps = {
  orders: OrderColumn[];
};

export const OrdersSection: React.FC<OrdersSectionProps> = ({ orders }) => {
  return (
    <Section>
      <SectionHeader>
        <Heading title={`Orders (${orders.length})`} description="Manage orders for your store" />
      </SectionHeader>
      <Separator />
      <SectionContent>
        <DataTable searchKey="products" columns={columns} data={orders} />
      </SectionContent>
    </Section>
  );
};
