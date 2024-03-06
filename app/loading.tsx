"use client";

import { CgSpinnerTwoAlt } from "react-icons/cg";

export default function Loading() {
  return (
    <div className="grid place-items-center w-full h-full">
      <CgSpinnerTwoAlt className="size-6 animate-spin" />
    </div>
  );
}
