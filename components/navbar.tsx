import { ThemeToggle } from "@/components/theme-toggle";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { StoreNav } from "@/components/store-nav";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Nav } from "@/components/nav";
import { ToggleProvider } from "@/providers/toggle.provider";

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
      <ToggleProvider>
        <Nav header={<StoreNav stores={stores} />}>
          <MainNav />
        </Nav>
      </ToggleProvider>
      <div className="flex flex-row gap-x-3">
        <ThemeToggle />
        <UserNav />
      </div>
    </div>
  );
};
