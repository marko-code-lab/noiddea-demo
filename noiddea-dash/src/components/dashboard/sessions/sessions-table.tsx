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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon, DeleteIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface UserSession {
  id: string;
  user_id: string;
  branch_id: string;
  started_at: string;
  closed_at: string | null;
  created_at: string;
  cash_amount?: number;
  digital_wallet_amount?: number;
  card_amount?: number;
  transfer_amount?: number;
  total_amount?: number;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  branch?: {
    id: string;
    name: string;
    location: string;
  };
}

interface SessionsTableProps {
  sessions: UserSession[];
  onSelectionChange?: (selectedIds: string[], selectedSessions: UserSession[]) => void;
  onCloseSession?: (sessionId: string) => Promise<void>;
  onDeleteSession?: (sessionId: string) => Promise<void>;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
}

function formatDuration(startedAt: string, closedAt: string | null): string {
  if (!closedAt) return 'En curso';

  try {
    const start = new Date(startedAt);
    const end = new Date(closedAt);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  } catch {
    return '-';
  }
}

export function SessionsTable({
  sessions,
  onSelectionChange,
  onCloseSession,
  onDeleteSession,
}: SessionsTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Calcular si todas las sesiones están seleccionadas (no solo las de la página actual)
  const allSessionsSelected = useMemo(() => {
    if (sessions.length === 0) return false;
    const selectedCount = Object.keys(rowSelection).length;
    return selectedCount === sessions.length;
  }, [sessions.length, rowSelection]);

  // Calcular si algunas sesiones están seleccionadas
  const someSessionsSelected = useMemo(() => {
    const selectedCount = Object.keys(rowSelection).length;
    return selectedCount > 0 && selectedCount < sessions.length;
  }, [sessions.length, rowSelection]);

  // Función para seleccionar/deseleccionar todas las sesiones
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

  const columns = useMemo<ColumnDef<UserSession>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={allSessionsSelected}
            onCheckedChange={(checked) => toggleSelectAll(!!checked, table)}
            aria-label='Seleccionar todos'
            {...(someSessionsSelected && { checked: 'indeterminate' })}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`Seleccionar sesión ${row.original.id}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'user',
        header: 'Usuario',
        cell: ({ row }) => <div>{row.original.user?.name || '-'}</div>,
      },
      {
        id: 'started_at',
        header: 'Inicio',
        cell: ({ row }) => <div>{formatDate(row.original.started_at)}</div>,
      },
      {
        id: 'closed_at',
        header: 'Fin',
        cell: ({ row }) => (
          <div>
            {row.original.closed_at ? formatDate(row.original.closed_at) : '-'}
          </div>
        ),
      },
      {
        id: 'duration',
        header: 'Duración',
        cell: ({ row }) => (
          <div>
            {formatDuration(row.original.started_at, row.original.closed_at)}
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Estado',
        cell: ({ row }) => (
          <Badge variant={row.original.closed_at ? 'secondary' : 'default'}>
            {row.original.closed_at ? 'Finalizada' : 'Activa'}
          </Badge>
        ),
      },
      {
        id: 'cash_amount',
        header: () => <div className='text-center'>Efectivo</div>,
        cell: ({ row }) => (
          <div className='text-center'>
            {formatCurrency(row.original.cash_amount || 0)}
          </div>
        ),
      },
      {
        id: 'digital_wallet_amount',
        header: () => <div className='text-center'>Billetera Digital</div>,
        cell: ({ row }) => (
          <div className='text-center'>
            {formatCurrency(row.original.digital_wallet_amount || 0)}
          </div>
        ),
      },
      {
        id: 'total_amount',
        header: () => <div className='text-center'>Total</div>,
        cell: ({ row }) => (
          <div className='text-center'>
            {formatCurrency(row.original.total_amount || 0)}
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const session = row.original;
          const isClosed = !!session.closed_at;

          return (
            <div className='flex justify-end'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon-sm'>
                    <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-40'>
                  {!isClosed && onCloseSession && (
                    <DropdownMenuItem onClick={() => onCloseSession(session.id)}>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} />
                      Cerrar sesión
                    </DropdownMenuItem>
                  )}
                  {isClosed && onDeleteSession && (
                    <DropdownMenuItem
                      onClick={() => {
                        console.log('[SessionsTable] Click en Archivar para sesión:', session.id);
                        console.log('[SessionsTable] Sesión cerrada:', isClosed);
                        console.log('[SessionsTable] onDeleteSession disponible:', !!onDeleteSession);
                        onDeleteSession(session.id);
                      }}
                      variant="destructive"
                    >
                      <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} />
                      Archivar
                    </DropdownMenuItem>
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
    [allSessionsSelected, someSessionsSelected, toggleSelectAll, onCloseSession, onDeleteSession]
  );

  // Mostrar controles cuando hay 30+ sesiones
  const showPaginationControls = sessions.length >= 30;

  const table = useReactTable({
    data: sessions,
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

  // Calcular selección basada en los IDs de fila seleccionados
  // Mapear los IDs de fila a las sesiones reales
  const selectedSessions = useMemo(() => {
    const selectedRowIds = Object.keys(rowSelection);
    if (selectedRowIds.length === 0) return [] as UserSession[];

    return selectedRowIds
      .map((rowId) => {
        // react-table usa índices como IDs por defecto
        const index = parseInt(rowId);
        return sessions[index];
      })
      .filter((s): s is UserSession => !!s);
  }, [rowSelection, sessions]);

  const selectedSessionIds = useMemo(() => selectedSessions.map((s) => s.id), [selectedSessions]);

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

    const currentSelectionString = [...selectedSessionIds].sort().join(',');

    if (prevSelectionRef.current !== currentSelectionString) {
      prevSelectionRef.current = currentSelectionString;
      onSelectionChangeRef.current(selectedSessionIds, selectedSessions);
    }
  }, [selectedSessionIds, selectedSessions]);

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
                <TableCell colSpan={columns.length} className='text-center text-muted-foreground py-8'>
                  No hay sesiones registradas
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
                {table.getFilteredRowModel().rows.length} sesión(es) seleccionada(s).
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
              de {table.getFilteredRowModel().rows.length} sesiones
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

