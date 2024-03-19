"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import type { Size } from "@prisma/client";

export type SizeColumnType = Pick<Size, "id" | "name" | "value"> & {
  createdAt: string;
};

export const columns: ColumnDef<SizeColumnType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction size={row.original} />,
  },
];
