import type { Metadata } from "next";
import { SignUp } from "./components/sign-up";

export const metadata: Metadata = {
  title: "Sign Up"
}

export default function Page() {
  return <SignUp />;
}
