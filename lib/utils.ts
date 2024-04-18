import { type ClassValue, clsx } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("en-Us", {
  style: "currency",
  currency: "USD",
});

export const catchException = (error: unknown) => {
  return NextResponse.json(
    { success: false, error: { message: (error as Error).message } },
    { status: 500 }
  );
};
