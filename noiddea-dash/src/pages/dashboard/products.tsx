import { CreateProductDialog } from '@/components/dashboard/products/create-product-dialog';
import { ProductsTable } from '@/components/dashboard/products/products-table';
import { DeleteProductsDialog } from '@/components/dashboard/products/delete-products-dialog';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { LoadingOverlay } from '@/components/loading-overlay';
import { useProducts, useSelectedBranch } from '@/hooks';
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchIcon, PackageOutOfStockIcon, DeleteIcon, SearchRemoveIcon, Building03Icon } from "@hugeicons/core-free-icons";
import { useState, useCallback, useMemo, useEffect } from 'react';
import type { ProductWithPresentations } from '@/types';
import { CreateReportDialog } from '@/components/dashboard/products/create-report-dialog';
import { cn } from '@/lib/utils';
import { ImportProductsDialog } from '@/components/dashboard/products';

export function ProductsPage() {
  const { selectedBranch, isLoading: branchLoading } = useSelectedBranch();

  // 1. Estados de búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [brandFilter] = useState<string>('all');

  // 2. Estados de selección
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductWithPresentations[]>([]);
  const [deleteProductsDialogOpen, setDeleteProductsDialogOpen] = useState(false);

  // 3. Debounce lógico: evita disparar la API en cada tecla
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 4. Carga de datos con TanStack Query (o similar)
  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
    isError: productsError,
    error: productsErrorData,
  } = useProducts(selectedBranch?.id, {
    search: debouncedSearch || undefined,
  });

  // 5. Carga solo para verificar existencia total (sin filtros)
  const { data: allProductsData } = useProducts(selectedBranch?.id, {});

  const products = productsData?.products || [];
  const hasProductsInInventory = (allProductsData?.products || []).length > 0;

  // 6. Filtrado y lógica de UI
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return brandFilter === 'all' || product.brand === brandFilter;
    });
  }, [products, brandFilter]);

  const allProductsSelected = useMemo(() => {
    return filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length;
  }, [filteredProducts, selectedProductIds]);

  // 7. Handlers simplificados
  const handleSelectionChange = useCallback((ids: string[], items: ProductWithPresentations[]) => {
    setSelectedProductIds(ids);
    setSelectedProducts(items);
  }, []);

  const handleBulkDeleteSuccess = () => {
    setSelectedProductIds([]);
    setSelectedProducts([]);
  };

  // 8. Gestión de estados de carga
  // "isLoading" es solo para la carga inicial (cuando no hay nada)
  const isInitialLoading = branchLoading || (productsLoading && !productsData);
  // "isUpdating" es cuando ya hay datos pero estamos buscando/refrescando
  const isUpdating = productsFetching;
  const hasValidBranch = selectedBranch && selectedBranch.id;

  return (
    <>
      {/* Solo bloqueamos la pantalla completa en la carga inicial profunda */}
      <LoadingOverlay isLoading={isInitialLoading} />

      {!isInitialLoading && (
        <div className="h-dvh container mx-auto p-6 flex flex-col space-y-4 overflow-y-auto">

          <div className={cn('flex justify-between gap-4', !hasProductsInInventory && 'hidden')}>
            <div className="flex items-center gap-2">
              <InputGroup className="w-96">
                <InputGroupInput
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  // Mantenemos el input habilitado siempre para fluidez
                  disabled={false}
                />
                <InputGroupAddon>
                  {isUpdating ? (
                    <Spinner className="size-4 animate-spin" />
                  ) : (
                    <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
                  )}
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <span className="text-xs font-medium">{products.length}</span>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="flex items-center gap-2">
              {selectedProductIds.length > 0 ? (
                <Button
                  variant="destructive"
                  onClick={() => setDeleteProductsDialogOpen(true)}
                  size="sm"
                >
                  <HugeiconsIcon icon={DeleteIcon} className="mr-2 size-4" />
                  {allProductsSelected ? 'Eliminar todos' : `Eliminar ${selectedProductIds.length}`}
                </Button>
              ) : (
                <>
                  <CreateReportDialog />
                  <CreateProductDialog />
                </>
              )}
            </div>
          </div>

          {/* Área de contenido principal */}
          <div className={cn("flex-1 h-full relative", productsError || !hasValidBranch || !hasProductsInInventory || filteredProducts.length === 0 ? 'flex items-center justify-center' : '')}>
            {productsError ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon"><HugeiconsIcon icon={PackageOutOfStockIcon} /></EmptyMedia>
                  <EmptyTitle>Error al cargar</EmptyTitle>
                  <EmptyDescription>{productsErrorData?.message}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : !hasValidBranch ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon"><HugeiconsIcon icon={Building03Icon} /></EmptyMedia>
                  <EmptyTitle>Selecciona una sucursal</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : !hasProductsInInventory ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon"><HugeiconsIcon icon={PackageOutOfStockIcon} /></EmptyMedia>
                  <EmptyTitle>No hay productos</EmptyTitle>
                  <EmptyDescription>Intenta con otro término o crea un producto.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex gap-2">
                    <ImportProductsDialog />
                    <CreateProductDialog />
                  </div>
                </EmptyContent>
              </Empty>
            )
              : filteredProducts.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon"><HugeiconsIcon icon={SearchRemoveIcon} /></EmptyMedia>
                    <EmptyTitle>No hay resultados</EmptyTitle>
                    <EmptyDescription>Intenta con otro término o crea un producto.</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <CreateProductDialog />
                  </EmptyContent>
                </Empty>)
                : (
                  <div className="relative">
                    {/* Overlay sutil solo sobre la tabla mientras carga, sin bloquear el input */}
                    {isUpdating && (
                      <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10 transition-opacity" />
                    )}
                    <ProductsTable
                      products={filteredProducts}
                      onSelectionChange={handleSelectionChange}
                      onBulkDelete={() => setDeleteProductsDialogOpen(true)}
                    />
                  </div>
                )}
          </div>
        </div>
      )}

      <DeleteProductsDialog
        productIds={selectedProductIds}
        productNames={selectedProducts.map((p) => p.name)}
        open={deleteProductsDialogOpen}
        onOpenChange={setDeleteProductsDialogOpen}
        onSuccess={handleBulkDeleteSuccess}
      />
    </>
  );
}