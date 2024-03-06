"use client";

import { SignIn as SignInClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export const SignIn = () => {
  const { resolvedTheme } = useTheme();
  return <SignInClerk appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }} />;
};
