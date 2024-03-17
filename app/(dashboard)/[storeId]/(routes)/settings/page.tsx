import { db } from "@/lib/db";
import type { Params } from "@/types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SettingsForm } from "./_components/settings-form";

export const metadata: Metadata = {
  title: "Settings",
};

type SettingsPageProps = Params<{ storeId: string }>;

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { storeId } = params;

  const store = await db.store.findUnique({
    where: {
      id: storeId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return <SettingsForm store={store} />;
}
