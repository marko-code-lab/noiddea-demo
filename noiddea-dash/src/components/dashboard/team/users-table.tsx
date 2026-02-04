'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { BusinessUser } from '@/hooks/use-business-users';
import { ResetBenefitDialog } from './reset-benefit-dialog';
import { DeleteUserDialog } from './delete-user-dialog';
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, ArrowReloadHorizontalIcon, MoreHorizontal } from "@hugeicons/core-free-icons";
import { formatCurrency } from '@/lib/currency';

interface UsersTableProps {
  users: BusinessUser[];
  onUserUpdated?: () => void;
}

const roleLabels: Record<string, string> = {
  cashier: 'Cajero',
};

export function UsersTable({ users, onUserUpdated }: UsersTableProps) {
  const [resettingUser, setResettingUser] = useState<BusinessUser | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<BusinessUser | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const handleResetBenefit = (user: BusinessUser) => {
    setResettingUser(user);
    setResetDialogOpen(true);
  };

  const handleDelete = (user: BusinessUser) => {
    setDeletingUser(user);
    setDeleteDialogOpen(true);
  };

  const handleSuccess = () => {
    onUserUpdated?.();
  };

  const columns = useMemo<ColumnDef<BusinessUser>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <div className="px-1">
            <Checkbox
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ row }) => `+51 ${row.original.phone || '-'}`,
      },
      {
        accessorKey: 'role',
        header: 'Rol',
        cell: ({ row }) => (
          <Badge variant="secondary">
            {roleLabels[row.original.role] || row.original.role}
          </Badge>
        ),
      },
      {
        accessorKey: 'benefit',
        header: () => <div className="text-center">Beneficio</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.benefit ? formatCurrency(row.original.benefit) : formatCurrency(0)}
          </div>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className='flex justify-end'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <HugeiconsIcon icon={MoreHorizontal} className="size-4" strokeWidth={2} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleResetBenefit(user)}>
                    <HugeiconsIcon icon={ArrowReloadHorizontalIcon} strokeWidth={2} />
                    Bonificacion
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(user)}
                  >
                    <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
                    Eliminar 
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de restablecimiento de beneficio */}
      <ResetBenefitDialog
        user={resettingUser}
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        onSuccess={handleSuccess}
      />

      {/* Diálogo de eliminación */}
      <DeleteUserDialog
        user={deletingUser}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}


