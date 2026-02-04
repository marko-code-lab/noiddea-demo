'use client';

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { PurchaseWithItems } from '@/types';
import { formatCurrency } from '@/lib/currency';
import { useMemo, useState, useCallback } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon, CheckmarkCircle02Icon, Cancel01Icon, Download01Icon } from "@hugeicons/core-free-icons";

interface PurchasesTableProps {
  purchases: PurchaseWithItems[];
  onReceivePurchase?: (purchaseId: string) => void;
  onCancelPurchase?: (purchaseId: string) => void;
  onViewDetails?: (purchaseId: string) => void;
  isReceiving?: boolean;
  isCancelling?: boolean;
  isDownloading?: boolean;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "approved":
      return "Aprobado";
    case "received":
      return "Recibido";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}

function getStatusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "pending":
      return "outline";
    case "approved":
      return "secondary";
    case "received":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

export function PurchasesTable({
  purchases,
  onReceivePurchase,
  onCancelPurchase,
  onViewDetails,
  isReceiving = false,
  isCancelling = false,
  isDownloading = false,
}: PurchasesTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Calcular si todos los pedidos están seleccionados (no solo los de la página actual)
  const allPurchasesSelected = useMemo(() => {
    if (purchases.length === 0) return false;
    const selectedCount = Object.keys(rowSelection).length;
    return selectedCount === purchases.length;
  }, [purchases.length, rowSelection]);

  // Calcular si algunos pedidos están seleccionados
  const somePurchasesSelected = useMemo(() => {
    const selectedCount = Object.keys(rowSelection).length;
    return selectedCount > 0 && selectedCount < purchases.length;
  }, [purchases.length, rowSelection]);

  // Función para seleccionar/deseleccionar todos los pedidos
  // Usar getCoreRowModel para obtener todas las filas (sin paginación)
  const toggleSelectAll = useCallback((checked: boolean, table: any) => {
    if (checked) {
      // Obtener todas las filas usando getCoreRowModel (antes de la paginación)
      const allRows = table.getCoreRowModel().flatRows;
      const allSelected: RowSelectionState = {};
      allRows.forEach((row: any) => {
        allSelected[row.id] = true;
      });
      setRowSelection(allSelected);
    } else {
      // Deseleccionar todos
      setRowSelection({});
    }
  }, []);

  const columns = useMemo<ColumnDef<PurchaseWithItems>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={allPurchasesSelected}
            onCheckedChange={(checked) => toggleSelectAll(!!checked, table)}
            aria-label='Seleccionar todos'
            {...(somePurchasesSelected && { checked: 'indeterminate' })}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`Seleccionar pedido`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'supplier',
        header: 'Proveedor',
        cell: ({ row }) => (
          <div>{row.original.supplier?.name || "-"}</div>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Fecha',
        cell: ({ row }) => (
          <div className="text-muted-foreground">
            {formatDate(row.original.created_at)}
          </div>
        ),
      },
      {
        id: 'delivery',
        header: 'Entrega',
        cell: ({ row }) => (
          <div>
            {row.original.notes?.includes("Pedido programado") ? "Programado" : "Inmediato"}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => (
          <Badge variant={getStatusVariant(row.original.status)}>
            {getStatusLabel(row.original.status)}
          </Badge>
        ),
      },
      {
        accessorKey: 'total',
        header: () => <div className='text-right'>Total</div>,
        cell: ({ row }) => (
          <div className='text-right font-medium'>
            {formatCurrency(row.original.total)}
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const purchase = row.original;
          return (
            <div className='flex justify-end'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon-sm'>
                    <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-40'>
                  <DropdownMenuItem
                    onClick={() => onViewDetails?.(purchase.id)}
                    disabled={isDownloading}
                  >
                    <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
                    Descargar PDF
                  </DropdownMenuItem>
                  {purchase.status === "pending" && (
                    <>
                      {onReceivePurchase && (
                        <DropdownMenuItem
                          onClick={() => onReceivePurchase(purchase.id)}
                          disabled={isReceiving}
                        >
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                          Recibir pedido
                        </DropdownMenuItem>
                      )}
                      {onCancelPurchase && (
                        <DropdownMenuItem
                          onClick={() => onCancelPurchase(purchase.id)}
                          disabled={isCancelling}
                          className="text-destructive focus:text-destructive"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                          Cancelar pedido
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                  {purchase.status === "cancelled" && (
                    <DropdownMenuItem disabled>Cancelado</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [allPurchasesSelected, somePurchasesSelected, toggleSelectAll, onReceivePurchase, onCancelPurchase, onViewDetails, isReceiving, isCancelling, isDownloading]
  );

  // Mostrar controles cuando hay 30+ pedidos
  const showPaginationControls = purchases.length >= 30;

  const table = useReactTable({
    data: purchases,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    initialState: {
      pagination: {
        pageSize: 30,
      },
    },
  });

  return (
    <div className='w-full'>
      <div className='border rounded-md overflow-x-auto'>
        <Table>
          <TableHeader className='bg-muted'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className={row.getIsSelected() ? 'bg-muted/50' : ''}
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
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No hay pedidos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Controles de paginación */}
      {showPaginationControls && (
        <div className='flex items-center justify-between space-x-2 py-4'>
          <div className='flex-1 text-sm text-muted-foreground'>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <span>
                {table.getFilteredSelectedRowModel().rows.length} de{' '}
                {table.getFilteredRowModel().rows.length} pedido(s) seleccionado(s).
              </span>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              de {table.getFilteredRowModel().rows.length} pedidos
            </span>
            <div className='space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
