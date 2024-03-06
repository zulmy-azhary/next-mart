"use client";

import { SignUp as SignUpClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export const SignUp = () => {
  const { resolvedTheme } = useTheme();
  return <SignUpClerk appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }} />;
};
