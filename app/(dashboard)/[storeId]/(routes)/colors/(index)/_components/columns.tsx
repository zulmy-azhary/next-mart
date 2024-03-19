"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import type { Color } from "@prisma/client";

export type ColorColumnType = Pick<Color, "id" | "name" | "value"> & {
  createdAt: string;
};

export const columns: ColumnDef<ColorColumnType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="w-full flex items-center gap-2">
        <span
          className="size-5 rounded-full !bg-center !bg-cover transition-all border"
          style={{ background: row.original.value }}
        />
        <p className="truncate flex-1">{row.original.value}</p>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction color={row.original} />,
  },
];
