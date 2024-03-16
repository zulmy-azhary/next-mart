"use client";

import type { Billboard } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type BillboardColumnType = Pick<Billboard, "id" | "label" | "imageUrl"> & {
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumnType>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction billboard={row.original} />,
  },
];
