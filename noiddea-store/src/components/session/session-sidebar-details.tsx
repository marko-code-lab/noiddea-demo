"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../providers/user-provider";
import { useBranch } from "../providers/branch-provider";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { useSessionSalesQuery } from "@/hooks/use-session-sales-query";
import { Spinner } from "../ui/spinner";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemTitle } from "../ui/item";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/lib/currency";
import { SidebarContent, SidebarFooter } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/lib/query-keys";

export function SessionDetails() {
  const { user, isLoading: isUserLoading } = useUser();
  const { branch, isLoading: isBranchLoading } = useBranch();
  const queryClient = useQueryClient();
  const { data, isLoading: isSessionSalesLoading, refetch } = useSessionSalesQuery(
    user?.id,
    branch?.id
  );

  // Refetchear la query cuando user y branch estén disponibles
  useEffect(() => {
    if (user?.id && branch?.id && !isUserLoading && !isBranchLoading) {
      // Invalidar y refetchear la query para asegurar que se obtengan los datos más recientes
      queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.sales(user.id, branch.id),
        refetchType: 'active',
      });
    }
  }, [user?.id, branch?.id, isUserLoading, isBranchLoading, queryClient, refetch]);

  const isLoading = isUserLoading || isBranchLoading || isSessionSalesLoading;
  const sales = data?.sales || [];
  const sessionStartTime = data?.sessionStartTime || null;
  const sessionStats = data?.sessionStats || null;

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      digital_wallet: "Billetera digital",
    };
    return labels[method] || method;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col">
      <SidebarContent
        className={cn(
          'flex-1 p-4 py-0',
          sales.length == 0 && 'flex items-center justify-center',
        )}
      >
        <div className="flex-1 overflow-y-scroll">
          {isLoading ? (
            <div className="h-full flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : sales.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <HugeiconsIcon icon={ShoppingCart01Icon} strokeWidth={2} />
                  </EmptyMedia>
                  <EmptyTitle>No hay ventas en esta sesión</EmptyTitle>
                  <EmptyDescription>
                    Las ventas realizadas durante esta sesión aparecerán aquí.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <ItemGroup className="gap-2">
              {sales.map((sale) => (
                <Item key={sale.id} variant="outline">
                  <ItemHeader>
                    {sale.sale_items && sale.sale_items.length > 0 && (
                      <div className="flex flex-col gap-1">
                        {sale.sale_items.map((item: any) => {
                          const product = item.product_presentation?.product
                          const presentation = item.product_presentation
                          const productName = product?.name || 'Producto'
                          const variant = presentation?.variant || ''

                          return (
                            <ItemDescription
                              key={item.id}
                              className="text-foreground"
                            >
                              <span className="font-medium">
                                {productName} x {item.quantity} {variant}
                              </span>
                            </ItemDescription>
                          )
                        })}
                      </div>
                    )}
                  </ItemHeader>
                  <ItemContent className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <ItemTitle>
                          {formatDateTime(sale.created_at || '')}
                        </ItemTitle>
                        <ItemDescription>
                          {sale.customer || 'Cliente general'}
                        </ItemDescription>
                        <div className="flex items-center gap-1 mt-1"></div>
                      </div>
                    </div>
                  </ItemContent>
                  <ItemContent>
                    <Badge variant="secondary">
                      {getPaymentMethodLabel(sale.payment_method)}
                    </Badge>
                  </ItemContent>
                  <ItemContent className="text-end">
                    <ItemTitle className="text-sm">
                      {formatCurrency(sale.total)}
                    </ItemTitle>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          )}
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {sessionStats && (
          <Item variant="muted">
            <ItemContent>
              {sessionStartTime && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Iniciado</span>
                  <span className="font-medium">
                    {formatTime(sessionStartTime)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total ventas</span>
                <span className="font-medium">
                  {formatCurrency(sessionStats.totalSales || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total efectivo</span>
                <span className="font-medium">
                  {formatCurrency(sessionStats.paymentTotals?.cash || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total billetera digital</span>
                <span className="font-medium">
                  {formatCurrency(sessionStats.paymentTotals?.digital_wallet || 0)}
                </span>
              </div>
            </ItemContent>
          </Item>
        )}
      </SidebarFooter>
    </div>
  )
}