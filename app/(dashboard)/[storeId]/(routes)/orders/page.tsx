import type { Params } from "@/types";
import type { Metadata } from "next";
import { OrdersSection } from "./_components/orders-section";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders",
};

type OrdersPageProps = Params<{ storeId: string }>;
export default async function OrdersPage({ params }: OrdersPageProps) {
  const { storeId } = params;

  const orders = await db.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders = orders.map((order) => ({
    ...order,
    products: order.orderItems.map((orderItem) => orderItem.product.name).join(", "),
    totalPrice: formatter.format(
      order.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    createdAt: format(order.createdAt, "MMMM do, yyyy"),
  }));

  return <OrdersSection orders={formattedOrders} />;
}
