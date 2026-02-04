import { useMemo, useState } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { ClockIcon, ArrowDataTransferVerticalIcon, DownloadIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { SessionsTable } from '@/components/dashboard/sessions';
import { exportSessionsToExcel } from '@/services/session-actions';
import { exportSessionsToExcelClient } from '@/lib/db/client-actions';
import { useUser } from '@/hooks';
import { useSelectedBranch } from '@/hooks';
import { LoadingOverlay } from '@/components/loading-overlay';
import { useSessionsQuery, useCloseSession, useDeleteSession } from '@/hooks/use-sessions-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isNative } from '@/lib/native';
import { toast } from 'sonner';

type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'user-asc'
  | 'user-desc'
  | 'total-desc'
  | 'total-asc'
  | 'status';

export function SessionsPage() {
  const { selectedBranch } = useSelectedBranch();
  const { user } = useUser();
  const [searchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [isExporting, setIsExporting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  // Determinar si debemos filtrar por sucursal
  // Si es local (branch real) filtramos por ID, si es global (business/owner) mostramos todo
  const shouldFilterByBranch = selectedBranch?.id !== selectedBranch?.business_id;

  // Usar React Query para obtener sesiones
  const { data: sessions = [], isLoading: loading } = useSessionsQuery(
    shouldFilterByBranch ? selectedBranch?.id : undefined
  );
  const closeSessionMutation = useCloseSession();
  const deleteSessionMutation = useDeleteSession();

  // Filtrar sesiones por búsqueda
  const filteredSessions = useMemo(() => {
    let filtered = sessions.filter((session) => {
      if (searchQuery === '') return true;

      const query = searchQuery.toLowerCase();
      return (
        session.user?.name.toLowerCase().includes(query) ||
        session.user?.email.toLowerCase().includes(query) ||
        session.branch?.name.toLowerCase().includes(query) ||
        session.branch?.location.toLowerCase().includes(query)
      );
    });

    // Aplicar ordenamiento
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'date-desc':
          return new Date(b.started_at).getTime() - new Date(a.started_at).getTime();
        case 'date-asc':
          return new Date(a.started_at).getTime() - new Date(b.started_at).getTime();
        case 'user-asc':
          return (a.user?.name || '').localeCompare(b.user?.name || '');
        case 'user-desc':
          return (b.user?.name || '').localeCompare(a.user?.name || '');
        case 'total-desc':
          return (b.total_amount || 0) - (a.total_amount || 0);
        case 'total-asc':
          return (a.total_amount || 0) - (b.total_amount || 0);
        case 'status':
          // Primero activas, luego finalizadas
          if (a.closed_at && !b.closed_at) return 1;
          if (!a.closed_at && b.closed_at) return -1;
          return new Date(b.started_at).getTime() - new Date(a.started_at).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [sessions, searchQuery, sortOption]);

  const handleExport = async () => {
    if (!user) {
      toast.error('Debes estar autenticado para exportar');
      return;
    }

    setIsExporting(true);
    try {
      const useClient = typeof window !== 'undefined' && isNative();
      const result = useClient
        ? await exportSessionsToExcelClient(user.id, selectedBranch?.id)
        : await exportSessionsToExcel(selectedBranch?.id);

      if (result.success && result.base64) {
        // Convertir base64 a blob
        const byteCharacters = atob(result.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename || 'reporte-sesiones.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(
          `Reporte generado correctamente. ${result.sessionCount || 0} sesiones exportadas.`
        );
      } else {
        toast.error(result.error || 'Error al generar el reporte');
      }
    } catch (error) {
      console.error('Error exportando sesiones:', error);
      toast.error('Error al exportar sesiones');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCloseSession = async (sessionId: string) => {
    closeSessionMutation.mutate(sessionId);
  };

  const handleDeleteSession = async (sessionId: string): Promise<void> => {
    console.log('[SessionsPage] handleDeleteSession llamado con sessionId:', sessionId);
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
    return Promise.resolve();
  };

  const confirmDeleteSession = () => {
    if (!sessionToDelete) return;
    console.log('[SessionsPage] Confirmado, ejecutando mutación para:', sessionToDelete);
    deleteSessionMutation.mutate(sessionToDelete, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSessionToDelete(null);
      },
      onError: () => {
        // El error ya se maneja en el hook
      },
    });
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case 'date-desc':
        return 'Fecha (más reciente)';
      case 'date-asc':
        return 'Fecha (más antigua)';
      case 'user-asc':
        return 'Usuario (A-Z)';
      case 'user-desc':
        return 'Usuario (Z-A)';
      case 'total-desc':
        return 'Total (mayor a menor)';
      case 'total-asc':
        return 'Total (menor a mayor)';
      case 'status':
        return 'Estado (activas primero)';
      default:
        return 'Ordenar';
    }
  };

  return (
    <div className={cn('p-6 space-y-4 h-dvh container mx-auto overflow-y-scroll', filteredSessions.length === 0 && !loading && 'flex items-center justify-center')}>
      <LoadingOverlay isLoading={loading} />
      {!loading && filteredSessions.length === 0 ? (
        <div className='py-24'>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant='icon'>
                <HugeiconsIcon icon={ClockIcon} strokeWidth={2} />
              </EmptyMedia>
              <EmptyTitle>
                {searchQuery
                  ? 'No se encontraron sesiones'
                  : 'No hay sesiones registradas'}
              </EmptyTitle>
              <EmptyDescription>
                {searchQuery
                  ? 'Intenta ajustar la búsqueda'
                  : 'Las sesiones de los usuarios en la tienda aparecerán aquí'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : !loading && (
        <>
          <header className='flex items-center justify-between'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <HugeiconsIcon icon={ArrowDataTransferVerticalIcon} strokeWidth={2} />
                  {getSortLabel()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className='w-50'>
                <DropdownMenuItem onClick={() => setSortOption('date-desc')}>
                  {sortOption === 'date-desc' && (
                    <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="mr-2" />
                  )}
                  Fecha (más reciente)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('date-asc')}>
                  {sortOption === 'date-asc' && (
                    <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="mr-2" />
                  )}
                  Fecha (más antigua)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('user-asc')}>
                  {sortOption === 'user-asc' && (
                    <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="mr-2" />
                  )}
                  Usuario (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('user-desc')}>
                  {sortOption === 'user-desc' && (
                    <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="mr-2" />
                  )}
                  Usuario (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('total-desc')}>
                  {sortOption === 'total-desc' && (
                    <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="mr-2" />
                  )}
                  Total (mayor a menor)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('total-asc')}>
                  {sortOption === 'total-asc' && (
                    <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="mr-2" />
                  )}
                  Total (menor a mayor)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption('status')}>
                  {sortOption === 'status' && (
                    <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="mr-2" />
                  )}
                  Estado (activas primero)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting || filteredSessions.length === 0}
            >
              {isExporting ? 'Exportando...' : 'Descargar'}
            </Button>
          </header>
          <SessionsTable
            sessions={filteredSessions}
            onCloseSession={handleCloseSession}
            onDeleteSession={handleDeleteSession}
          />
        </>
      )}

      {/* Diálogo de confirmación para eliminar sesión */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de archivar esta sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La sesión será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              console.log('[SessionsPage] Usuario canceló la eliminación');
              setSessionToDelete(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSession}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSessionMutation.isPending}
            >
              {deleteSessionMutation.isPending ? 'Archivando...' : 'Archivar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
