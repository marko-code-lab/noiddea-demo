"use client";

/**
 * @deprecated Use useProductsQuery from '@/hooks/use-products-query' instead
 * This hook is kept for backward compatibility but will be removed in future versions
 */
import { useProductsQuery } from "./use-products-query";
import { useBranch } from "@/components/providers/branch-provider";

export function useProducts() {
  const { branch } = useBranch();
  const { data: products = [], isLoading, error } = useProductsQuery(branch?.id);
  
  return { products, isLoading, error };
}
