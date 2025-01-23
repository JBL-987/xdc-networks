"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";

import { DataTableColumnHeader } from "@/components/demo/dashboard/data-table-column-header";
import { DataTableRowActions } from "@/components/demo/dashboard/data-table-row-actions";
import { User } from "@/constants/dashboard";
import { usersRole, usersStatus } from "@/constants/dashboard";
import CopyText from "./copyText";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fileName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"File Name"} />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("fileName")}</div>;
    }
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"description"} />
    )
  },
  {
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Document owner"} />
    ),
    cell: ({ row }) => {
      return <CopyText text={row.getValue("document_hash")} />;
    }
  },
  // {
  //   accessorKey: "role",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title={"Role"} />,
  //   cell: ({ row }) => {
  //     const role = usersRole.find((role) => role.value === row.getValue("role"));

  //     if (!role) {
  //       // If a value is not what you expect or does not exist you can return null.
  //       return null;
  //     }

  //     return <span>{role.label}</span>;
  //   },
  // },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Status"} />
    ),
    cell: ({ row }) => {
      const status = usersStatus.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div
          className={clsx("flex w-[100px] items-center", {
            "text-red-500": status.value === "rejected",
            "text-orange-400": status.value === "pending",
            "text-green-500": status.value === "verified"
          })}
        >
          {status.icon && (
            <status.icon
              className={`mr-2 h-4 w-4 ${
                status.value === "rejected"
                  ? "text-red-500"
                  : status.value === "pending"
                  ? "text-orange-400"
                  : "text-green-500"
              }`}
            />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "document_hash",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Documents Hash"} />
    ),
    cell: ({ row }) => {
      return <CopyText text={row.getValue("document_hash")} />;
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={"Created at"} />
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
