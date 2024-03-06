import type { Metadata } from "next";
import { SignIn } from "./components/sign-in";

export const metadata: Metadata = {
  title: "Sign In"
}

export default function Page() {
  return <SignIn />;
}
