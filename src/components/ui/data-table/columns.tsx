"use client"

import { Badge, BadgeProps } from "@/components/Badge"
import { Checkbox } from "@/components/Checkbox"
import { statuses } from "@/data/data"
import { Usage } from "@/data/schema"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./DataTableColumnHeader"
import { DataTableRowActions } from "./DataTableRowActions"

const columnHelper = createColumnHelper<Usage>()

export const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={() => table.toggleAllPageRowsSelected()}
        className="translate-y-0.5"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
        className="translate-y-0.5"
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      displayName: "Select",
    },
  }),
  columnHelper.accessor("resourceName", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Resource" />
    ),
    enableSorting: true,
    enableHiding: false,
    meta: {
      className: "text-left",
      displayName: "resourceName",
    },
  }),


  columnHelper.accessor("professor", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Professor" />
    ),
    enableSorting: true,
    enableHiding: false,
    meta: {
      className: "text-left",
      displayName: "professor",
    },
  }),

  columnHelper.accessor("course", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course" />
    ),
    enableSorting: false,
    meta: {
      className: "text-left",
      displayName: "course",
    },
    filterFn: "arrIncludesSome",
  }),

  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    enableSorting: true,
    meta: {
      className: "text-left",
      displayName: "Status",
    },
    cell: ({ row }) => {
      const status = statuses.find(
        (item) => item.value === row.getValue("status"),
      )

      if (!status) {
        return null
      }

      return (
        <Badge variant={status.variant as BadgeProps["variant"]}>
          {status.label}
        </Badge>
      )
    },
  }),

  columnHelper.accessor("lastEdited", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last edited" />
    ),
    enableSorting: false,
    meta: {
      className: "tabular-nums",
      displayName: "Last edited",
    },
  }),
  columnHelper.display({
    id: "edit",
    header: "Edit",
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: "text-right",
      displayName: "Edit",
    },
    cell: ({ row }) => <DataTableRowActions row={row} />,
  }),
] as ColumnDef<Usage>[]
