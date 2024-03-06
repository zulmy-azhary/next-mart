"use client";

import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export const UserNav = () => {
  const { resolvedTheme } = useTheme();
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }}
    />
  );
};
