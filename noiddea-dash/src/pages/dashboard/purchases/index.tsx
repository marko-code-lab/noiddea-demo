import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { LoadingOverlay } from "@/components/loading-overlay";

import { PlusSignIcon, ShoppingBag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useBranch } from "@/components/providers/branch-provider";
import { usePurchasesQuery, useReceivePurchase, useUpdatePurchaseStatus } from "@/hooks/use-purchases-query";
import { useAutoReceiveScheduledPurchases } from "@/hooks/use-auto-receive-scheduled-purchases";
import { useDownloadPurchasePdf } from "@/hooks/use-download-purchase-pdf";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PurchasesTable } from "@/components/dashboard/purchases/purchases-table";

export function PurchasesPage() {
  const { branch, isLoading: branchLoading } = useBranch();
  const { data: purchases = [], isLoading: purchasesLoading, error } = usePurchasesQuery(
    branch?.id, // business_id
    undefined // branchId
  );
  const receivePurchaseMutation = useReceivePurchase();
  const updatePurchaseStatusMutation = useUpdatePurchaseStatus();
  const { downloadPurchasePdf, isDownloading } = useDownloadPurchasePdf();

  // Hook para recibir automáticamente pedidos programados cuando llegue su fecha/hora
  useAutoReceiveScheduledPurchases(branch?.id);

  const handleDownloadPdf = async (purchaseId: string) => {
    try {
      await downloadPurchasePdf(purchaseId);
    } catch {
      // Toast ya se muestra en el hook
    }
  };

  const handleCancelPurchase = async (purchaseId: string) => {
    try {
      const result = await updatePurchaseStatusMutation.mutateAsync({
        purchaseId,
        status: 'cancelled',
      });
      if (result.success) {
        toast.success("Pedido cancelado exitosamente");
      } else {
        toast.error(result.error || "Error al cancelar el pedido");
      }
    } catch (error) {
      console.error("Error cancelando pedido:", error);
      toast.error("Error al cancelar el pedido");
    }
  };

  const handleReceivePurchase = async (purchaseId: string) => {
    console.log('[handleReceivePurchase] Iniciando recepción de pedido:', purchaseId);
    try {
      // Buscar el pedido para verificar si es programado
      const purchase = purchases.find((p) => p.id === purchaseId);
      const isScheduled = purchase?.notes?.includes("Pedido programado");

      console.log('[handleReceivePurchase] Pedido encontrado:', purchase?.id, 'Programado:', isScheduled);

      const result = await receivePurchaseMutation.mutateAsync(purchaseId);

      console.log('[handleReceivePurchase] Resultado de la mutación:', result);

      if (!result) {
        console.error('[handleReceivePurchase] No se recibió respuesta del servidor');
        toast.error("No se recibió respuesta del servidor");
        return;
      }

      if (result.success) {
        console.log('[handleReceivePurchase] Pedido recibido exitosamente');
        if (isScheduled) {
          // Extraer la fecha y hora de las notas si están disponibles
          const notesMatch = purchase?.notes?.match(/Fecha de entrega: (.+?) a las (.+)/);
          const deliveryInfo = notesMatch
            ? ` programado para ${notesMatch[1]} a las ${notesMatch[2]}`
            : " programado";

          toast.success(
            `¡Pedido recibido exitosamente!${deliveryInfo}. Inventario actualizado.`,
            {
              duration: 5000,
            }
          );
        } else {
          toast.success("Pedido recibido exitosamente. Inventario actualizado.");
        }
      } else {
        const errorMessage = result.error || "Error al recibir el pedido";
        console.error("[handleReceivePurchase] Error en resultado:", errorMessage);
        toast.error(errorMessage, { duration: 5000 });
      }
    } catch (error) {
      console.error("[handleReceivePurchase] Excepción capturada:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al recibir el pedido";
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const isLoading = branchLoading || purchasesLoading;

  return (
    <div className="">
      <LoadingOverlay isLoading={isLoading} />
      <div className="p-6 space-y-4">
        <header className={cn("flex items-center justify-end", purchases.length === 0 && 'hidden')}>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Descargar
            </Button>
            <Link to="/dashboard/purchases/create">
              <Button size="sm">
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                Crear pedido
              </Button>
            </Link>
          </div>
        </header>
        {error ? (
          <div className="border rounded-lg p-8">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Error al cargar pedidos</EmptyTitle>
                <EmptyDescription>{error instanceof Error ? error.message : "Error desconocido"}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex items-center justify-center h-dvh">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={ShoppingBag01Icon} strokeWidth={2} />
                </EmptyMedia>
                <EmptyTitle>No hay pedidos</EmptyTitle>
                <EmptyDescription>Comienza creando tu primer pedido de compra</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link to="/dashboard/purchases/create">
                  <Button>
                    <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                    Crear pedido
                  </Button>
                </Link>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <PurchasesTable
            purchases={purchases}
            onReceivePurchase={handleReceivePurchase}
            onCancelPurchase={handleCancelPurchase}
            onViewDetails={handleDownloadPdf}
            isReceiving={receivePurchaseMutation.isPending}
            isCancelling={updatePurchaseStatusMutation.isPending}
            isDownloading={isDownloading}
          />
        )}
      </div>
    </div>
  );
}
