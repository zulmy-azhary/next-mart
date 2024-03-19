"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "@prisma/client";
import { CellAction } from "./cell-action";

export type CategoryColumn = Pick<Category, "id" | "name"> & {
  billboardLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction category={row.original} />,
  },
];
