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
import type { ProductWithPresentations } from '@/types';
import { formatCurrency } from '@/lib/currency';
import {
  EditProductDialog,
  DeleteProductDialog,
  DeleteProductsDialog,
} from '@/components/dashboard/products';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon, EditIcon, DeleteIcon } from "@hugeicons/core-free-icons";

interface ProductsTableProps {
  products: ProductWithPresentations[];
  onProductUpdated?: () => void;
  onSelectionChange?: (selectedIds: string[], selectedProducts: ProductWithPresentations[]) => void;
  onBulkDelete?: () => void;
}

export function ProductsTable({
  products,
  onProductUpdated,
  onSelectionChange,
  onBulkDelete,
}: ProductsTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [editingProduct, setEditingProduct] = useState<ProductWithPresentations | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<ProductWithPresentations | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteProductsDialogOpen, setDeleteProductsDialogOpen] = useState(false);

  // Calcular si todos los productos están seleccionados (no solo los de la página actual)
  const allProductsSelected = useMemo(() => {
    if (products.length === 0) return false;
    const selectedCount = Object.keys(rowSelection).length;
    return selectedCount === products.length;
  }, [products.length, rowSelection]);

  // Calcular si algunos productos están seleccionados
  const someProductsSelected = useMemo(() => {
    const selectedCount = Object.keys(rowSelection).length;
    return selectedCount > 0 && selectedCount < products.length;
  }, [products.length, rowSelection]);

  // Función para seleccionar/deseleccionar todos los productos
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

  const columns = useMemo<ColumnDef<ProductWithPresentations>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={allProductsSelected}
            onCheckedChange={(checked) => toggleSelectAll(!!checked, table)}
            aria-label='Seleccionar todos'
            {...(someProductsSelected && { checked: 'indeterminate' })}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`Seleccionar producto${row.original.name}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: 'Producto',
        cell: ({ row }) => <div>{row.original.name}</div>,
      },
      {
        id: 'expiration',
        header: 'Vencimiento',
        cell: ({ row }) => {
          const expiration = (row.original as any).expiration;
          if (!expiration) return <div>-</div>;
          try {
            const date = new Date(expiration);
            return <div>{date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>;
          } catch {
            return <div>-</div>;
          }
        },
      },
      {
        accessorKey: 'brand',
        header: 'Marca',
        cell: ({ row }) => <div>{row.original.brand || '-'}</div>,
      },
      {
        id: 'cost',
        header: () => <div className='text-center'>Costo</div>,
        cell: ({ row }) => (
          <div className='text-center'>
            {(row.original as any).cost ? formatCurrency((row.original as any).cost) : '-'}
          </div>
        ),
      },
      {
        id: 'price',
        header: () => <div className='text-center'>Venta</div>,
        cell: ({ row }) => (
          <div className='text-center'>
            {(row.original as any).price ? formatCurrency((row.original as any).price) : '-'}
          </div>
        ),
      },
      {
        id: 'bonification',
        header: () => <div className='text-center'>Bonificación</div>,
        cell: ({ row }) => (
          <div className='text-center'>
            {(row.original as any).bonification
              ? formatCurrency((row.original as any).bonification)
              : '-'}
          </div>
        ),
      },
      {
        accessorKey: 'stock',
        header: () => <div className='text-center'>Stock</div>,
        cell: ({ row }) => <div className='text-center'>{row.original.stock ?? 0}</div>,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className='flex justify-end'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon-sm'>
                    <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => handleEdit(product)}>
                    <HugeiconsIcon icon={EditIcon} strokeWidth={2} />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='text-destructive'
                    onClick={() => handleDelete(product)}
                  >
                    <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [allProductsSelected, someProductsSelected, toggleSelectAll]
  );

  // Usar siempre paginación del cliente (como en el ejemplo de shadcn)
  // Mostrar controles cuando hay 30+ productos
  const showPaginationControls = products.length >= 30;

  const table = useReactTable({
    data: products,
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
        pageSize: 30, // Mostrar 30 productos por página
      },
    },
  });

  // Calcular selección basada en los IDs de fila seleccionados
  // Mapear los IDs de fila a los productos reales
  const selectedProducts = useMemo(() => {
    const selectedRowIds = Object.keys(rowSelection);
    if (selectedRowIds.length === 0) return [] as ProductWithPresentations[];
    
    return selectedRowIds
      .map((rowId) => {
        // react-table usa índices como IDs por defecto
        const index = parseInt(rowId);
        return products[index];
      })
      .filter((p): p is ProductWithPresentations => !!p);
  }, [rowSelection, products]);

  const selectedProductIds = useMemo(() => selectedProducts.map((p) => p.id), [selectedProducts]);

  // Usar ref para evitar llamadas innecesarias y rastrear el callback
  const prevSelectionRef = useRef<string>('');
  const onSelectionChangeRef = useRef(onSelectionChange);

  // Mantener el ref actualizado
  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  // Notificar cambios en la selección solo si realmente cambió
  useEffect(() => {
    if (!onSelectionChangeRef.current) return;

    const currentSelectionString = [...selectedProductIds].sort().join(',');

    if (prevSelectionRef.current !== currentSelectionString) {
      prevSelectionRef.current = currentSelectionString;
      onSelectionChangeRef.current(selectedProductIds, selectedProducts);
    }
  }, [selectedProductIds, selectedProducts]);

  const handleEdit = (product: ProductWithPresentations) => {
    setEditingProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = (product: ProductWithPresentations) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    onProductUpdated?.();
  };

  const handleDeleteSuccess = () => {
    setRowSelection({});
    onProductUpdated?.();
  };


  return (
    <div className='w-full'>
      <div className='border rounded-md overflow-hidden'>
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
                  No hay productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de edición */}
      <EditProductDialog
        product={editingProduct}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      {/* Diálogo de eliminación individual */}
      <DeleteProductDialog
        product={deletingProduct}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />

      {/* Diálogo de eliminación múltiple (solo si no se pasa onBulkDelete) */}
      {!onBulkDelete && (
        <DeleteProductsDialog
          productIds={selectedProductIds}
          productNames={selectedProducts.map((p) => p.name)}
          open={deleteProductsDialogOpen}
          onOpenChange={setDeleteProductsDialogOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {/* Controles de paginación - siempre usar paginación del cliente */}
      {showPaginationControls && (
        <div className='flex items-center justify-between space-x-2 py-4'>
          <div className='flex-1 text-sm text-muted-foreground'>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <span>
                {table.getFilteredSelectedRowModel().rows.length} de{' '}
                {table.getFilteredRowModel().rows.length} producto(s) seleccionado(s).
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
              de {table.getFilteredRowModel().rows.length} productos
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
