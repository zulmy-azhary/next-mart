import { db } from "@/lib/db";
import type { Params } from "@/types";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

export const metadata: Metadata = {
  title: "Settings",
};

type SettingsPageProps = Params<{ storeId: string }>;

export default async function SettingsPage({ params }: SettingsPageProps) {
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

  return <SettingsForm store={store} />;
}
