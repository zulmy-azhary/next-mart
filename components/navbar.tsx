import { ThemeToggle } from "@/components/theme-toggle";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { StoreNav } from "@/components/store-nav";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const Navbar = async () => {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });
  
  return (
    <div className="flex flex-row justify-between px-6 py-4 border-b">
      <StoreNav stores={stores} />
      <MainNav />
      <div className="flex flex-row gap-x-3">
        <ThemeToggle />
        <UserNav />
      </div>
    </div>
  );
};
