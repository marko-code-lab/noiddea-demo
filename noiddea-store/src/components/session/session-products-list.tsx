"use client";

import { ItemGroup } from "../ui/item";
import * as React from "react";
import { useCart } from "../providers/cart-provider";
import { useBranch } from "@/components/providers/branch-provider";
import { useProductsQuery } from "@/hooks/use-products-query";
import { useDebounce } from "@/hooks/use-debounce";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { PackageOutOfStockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CartProduct } from "@/types";
import { cn } from "@/lib/utils";
import { SearchProduct } from "./session-search-products";
import { useState } from "react";
import { ProductItem } from "./session-product-item";


ProductItem.displayName = "ProductItem";

const PRODUCTS_PER_PAGE = 50;

export function SessionList() {
  const [search, setSearch] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = React.useState<number>(PRODUCTS_PER_PAGE);
  // Debounce de la búsqueda para evitar filtrados en cada tecla
  const debouncedSearch = useDebounce(search, 200);
  const { addToCart } = useCart();
  const { branch } = useBranch();
  const { data: products = [], isLoading } = useProductsQuery(branch?.id);

  // Memoizar el filtrado de productos (busca en TODOS los productos)
  const filteredProducts = React.useMemo(() => {
    const searchValue = typeof debouncedSearch === "string"
      ? debouncedSearch.trim()
      : "";
  
    let filtered = products;

    // Filtrar por marca si está seleccionada
    if (selectedBrand) {
      filtered = filtered.filter((product: any) => product.brand === selectedBrand);
    }
  
    // Filtrar por búsqueda de texto si hay valor
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter((product: any) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower)
      );
    }
  
    return filtered;
  }, [products, debouncedSearch, selectedBrand]);

  // Resetear el límite cuando cambia la búsqueda o la marca
  React.useEffect(() => {
    setDisplayLimit(PRODUCTS_PER_PAGE);
  }, [debouncedSearch, selectedBrand]);

  // Productos a mostrar (solo los primeros N)
  const displayedProducts = React.useMemo(() => {
    return filteredProducts.slice(0, displayLimit);
  }, [filteredProducts, displayLimit]);

  // Memoizar el handler de agregar al carrito
  const handleAddToCart = React.useCallback((product: CartProduct) => {
    addToCart(product);
    setSearch(""); // Limpiar el input de búsqueda después de agregar al carrito
  }, [addToCart, setSearch]);

  return (
    <div className="h-dvh overflow-hidden">
      <div className="w-full p-4 pt-0 rounded-xl size-full flex flex-col space-y-4 overflow-hidden">
        <div className={cn("w-full flex-1 overflow-y-scroll")}>
          {isLoading ? (
            <Button variant="ghost" className="pointer-events-none w-full"><Spinner /> Cargando productos</Button>
          ) : products.length === 0 ? (
            <Empty className="h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={PackageOutOfStockIcon} strokeWidth={2} />
                </EmptyMedia>
                <EmptyTitle>No hay productos disponibles en esta sucursal</EmptyTitle>
                <EmptyDescription>
                  Añade productos al carrito para continuar.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <ItemGroup className="grid grid-cols-2 2xl:grid-cols-3 gap-4 pt-4">
                {displayedProducts.map((product: any) => (
                  <ProductItem 
                    key={product.id} 
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </ItemGroup>
            </>
          )}
        </div>
      </div>
      <SearchProduct 
        search={search} 
        setSearch={setSearch}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        totalProducts={filteredProducts.length}
        totalAvailable={products.length}
      />
    </div>
  );
}