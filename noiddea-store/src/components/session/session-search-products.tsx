"use client";

import { useProductsQuery } from "@/hooks/use-products-query";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "../ui/input-group";
import { useBranch } from "../providers/branch-provider";
import { HugeiconsIcon } from "@hugeicons/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { ArrowUp02Icon, FilterIcon, TagIcon } from "@hugeicons/core-free-icons";
import React from "react";
import { cn } from "@/lib/utils";

export function SearchProduct({
  search, 
  setSearch,
  selectedBrand,
  setSelectedBrand,
  totalProducts = 0,
  totalAvailable = 0
}: {
  search: string;
  setSearch: (search: string) => void;
  selectedBrand: string | null;
  setSelectedBrand: (brand: string | null) => void;
  totalProducts?: number;
  totalAvailable?: number;
}) {
    const { branch } = useBranch();
    const { data: products = [] } = useProductsQuery(branch?.id);
    const inputRef = React.useRef<HTMLInputElement>(null);
    
    // Usar totalProducts si está disponible (productos filtrados), sino usar products.length
    const displayCount = totalProducts > 0 ? totalProducts : (totalAvailable > 0 ? totalAvailable : products.length);

    // Extract unique brands from products
    const availableBrands = React.useMemo(() => {
      const brands = products
        .map(product => product.brand)
        .filter((brand): brand is string => Boolean(brand && brand.trim()))
        .filter((brand, index, self) => self.indexOf(brand) === index) // Get unique values
        .sort(); // Sort alphabetically
      return brands;
    }, [products]);

    const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    }, [setSearch]);

    // Focus input when space key is pressed (unless already typing in another input)
    React.useEffect(() => {
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        // Only focus if space is pressed and user is not typing in an input, textarea, etc.
        if (e.key === ' ' && 
            e.target instanceof HTMLElement && 
            e.target.tagName !== 'INPUT' && 
            e.target.tagName !== 'TEXTAREA' &&
            !e.target.isContentEditable) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      };

      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => {
        window.removeEventListener('keydown', handleGlobalKeyDown);
      };
    }, []);
    
  return (
    <div className="sticky bottom-0 left-0 right-0 p-4">
      <InputGroup className="w-2xl mx-auto bg-card dark:bg-card! z-10">
        <InputGroupInput 
          ref={inputRef}
          placeholder="Busqueda de productos, por nombre o descripción..."
          value={search}
          onChange={handleSearchChange}
          className="mb-4"
        />
        <InputGroupAddon align="block-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="outline"> <HugeiconsIcon icon={TagIcon} strokeWidth={2} />Categoria</InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
            >
              <DropdownMenuItem>General</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="outline">
                <HugeiconsIcon icon={FilterIcon} strokeWidth={2} />
                {selectedBrand ? selectedBrand : "Marca"}
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="center"
              className="w-44"
            >
              {selectedBrand && (
                <>
                  <DropdownMenuItem onClick={() => setSelectedBrand(null)}>
                    Todas las marcas
                  </DropdownMenuItem>
                  <Separator className="my-1" />
                </>
              )}
              {availableBrands.length > 0 ? (
                availableBrands.map((brand) => (
                  <DropdownMenuItem 
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                  >
                    {brand}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No hay marcas disponibles</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <InputGroupText className="ml-auto">{displayCount} productos</InputGroupText>
          <Separator orientation="vertical" className="my-2!" />
          <InputGroupButton
            variant="default"
            className="rounded-full relative"
            size="icon-sm"
            type="button"
            disabled={!search.length}
            onClick={() => setSearch("")}
          >
            <HugeiconsIcon 
              icon={ArrowUp02Icon} 
              strokeWidth={2}
              className={cn(
                "transition-all duration-200 relative z-10",
                search.length && "scale-110 animate-pulse"
              )}
            />
            <span className="sr-only">{search.length ? "Limpiar búsqueda" : "Buscar"}</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
)
}