import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type SetupLayoutProps = { children: React.ReactNode };

export default async function SetupLayout({ children }: SetupLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: { userId },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
