import { Navbar } from "@/components/navbar";
import { db } from "@/lib/db";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type StoreParams = Params<{ storeId: string }>;

type DashboardLayoutProps = StoreParams & {
  children: React.ReactNode;
};

export async function generateMetadata({ params }: StoreParams): Promise<Metadata> {
  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return {
    title: {
      default: `Next Mart | Home`,
      template: `${store?.name ?? "Next Mart"} | %s`,
    },
  };
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <main className="space-y-4 p-8 pt-6">{children}</main>
    </>
  );
}
