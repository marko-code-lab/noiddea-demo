"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartProduct, ProductWithPresentations } from "@/types";
import { queryKeys } from "@/lib/query-keys";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/services";
import { getProductsClient, createProductClient, updateProductClient, deleteProductClient } from "@/lib/db/client-actions";
import { isNative } from "@/lib/native";
import { useUser } from "./use-user";

export function useProductsQuery(branchId: string | null | undefined) {
  const { user, isLoading: userLoading } = useUser();
  
  return useQuery({
    queryKey: branchId ? queryKeys.branchProducts.all(branchId) : ["products", "no-branch"],
    queryFn: async (): Promise<CartProduct[]> => {
      if (!branchId) {
        return [];
      }

      if (!user) {
        return [];
      }

      // En modo Electron, usar la versión cliente que usa IPC
      // Pasar un límite alto para obtener todos los productos para búsqueda
      // El filtrado se hace en el cliente, pero necesitamos todos los productos cargados
      const result = typeof window !== 'undefined' && isNative()
        ? await getProductsClient(user.id, branchId, { limit: 10000 })
        : await getProducts(branchId, { limit: 10000 });

      if (!result.success || !result.products) {
        return [];
      }

      // Transform data to match CartProduct interface
      const mappedProducts: CartProduct[] = [];

      result.products.forEach((product) => {
        const presentations = product.product_presentations
          ?.filter((p: any) => p.is_active)
          .map((p: any) => ({
            id: p.id,
            variant: p.variant,
            units: p.units,
            price: p.price || product.price,
          })) || [];

        mappedProducts.push({
          id: product.id,
          name: product.name,
          brand: product.brand || "",
          description: product.description || "",
          image: "/item.webp",
          stock: product.stock || 0,
          basePrice: product.price || 0,
          baseCost: product.cost || 0,
          bonification: product.bonification || null,
          expiration: product.expiration || null,
          presentations: presentations,
          quantity: 0,
        });
      });

      return mappedProducts;
    },
    enabled: !!branchId && !!user && !userLoading, // Solo ejecutar si hay branchId, usuario y no está cargando
    staleTime: 2 * 60 * 1000, // 2 minutos - los productos pueden cambiar más frecuentemente
    retry: 1,
    // Evitar refetches innecesarios que causan recargas
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (data: Parameters<typeof createProduct>[0]) => {
      if (typeof window !== 'undefined' && isNative() && user) {
        return await createProductClient(user.id, data);
      }
      return await createProduct(data);
    },
    onSuccess: (_, variables) => {
      // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.branchProducts.all(variables.branchId),
        refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
      });
      queryClient.invalidateQueries({ 
        queryKey: ["products"],
        refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async ({ productId, data }: { productId: string; data: any }) => {
      if (typeof window !== 'undefined' && isNative() && user) {
        return await updateProductClient(user.id, productId, data);
      }
      return await updateProduct(productId, data);
    },
    onSuccess: () => {
      // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
      queryClient.invalidateQueries({ 
        queryKey: ["products"],
        refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
      });
      queryClient.invalidateQueries({ 
        queryKey: ["products", "branch"],
        refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (typeof window !== 'undefined' && isNative() && user) {
        return await deleteProductClient(user.id, productId);
      }
      return await deleteProduct(productId);
    },
    onSuccess: () => {
      // Invalidar y refetchear todas las queries relacionadas para actualización automática en tiempo real
      queryClient.invalidateQueries({ 
        queryKey: ["products"],
        refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
      });
      queryClient.invalidateQueries({ 
        queryKey: ["products", "branch"],
        refetchType: 'all', // Refetchear todas las queries relacionadas (activas e inactivas)
      });
    },
  });
}

export function useProduct(productId?: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      // Implementar si es necesario
      return null;
    },
    enabled: !!productId,
  });
}

/**
 * Hook para obtener productos como ProductWithPresentations (para la tabla de productos)
 */
export function useProducts(
  branchId: string | null | undefined,
  options?: {
    search?: string;
    page?: number;
    limit?: number;
  }
) {
  // Obtener el usuario actual usando el hook que ya maneja Electron/server
  const { user, isLoading: userLoading } = useUser();
  
  // Construir query key que incluya search para cache apropiado
  // Si no hay page/limit, significa que queremos todos los productos (paginación del cliente)
  const queryKey = branchId
    ? [...queryKeys.branchProducts.all(branchId), options?.search || '', 'all']
    : ["products", "no-branch", options?.search || '', 'all'];
  
  return useQuery({
    queryKey,
    queryFn: async (): Promise<{
      products: ProductWithPresentations[];
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }> => {
      if (!branchId) {
        return { products: [] };
      }

      if (!user) {
        throw new Error('Debes estar autenticado');
      }
      
      // Si no se especifica page/limit, cargar todos los productos (hasta 10000 para manejar grandes volúmenes)
      const fetchOptions = options?.page && options?.limit 
        ? options 
        : { ...options, page: 1, limit: 10000 }; // Cargar hasta 10000 productos cuando no hay paginación del servidor
      
      const result = typeof window !== 'undefined' && isNative()
        ? await getProductsClient(user.id, branchId, fetchOptions)
        : await getProducts(branchId, fetchOptions);

      if (!result.success) {
        // Si hay un error, lanzarlo para que React Query lo maneje correctamente
        throw new Error(result.error || 'Error al obtener productos');
      }

      if (!result.products) {
        return { products: [] };
      }

      return {
        products: result.products as ProductWithPresentations[],
        // No devolver pagination cuando se cargan todos los productos
      };
    },
    enabled: !!branchId && !!user && !userLoading, // Solo ejecutar si hay branchId, usuario y no está cargando
    staleTime: 0, // Los datos se consideran stale inmediatamente para asegurar actualizaciones después de invalidaciones
    retry: 1,
    gcTime: 5 * 60 * 1000, // 5 minutos de garbage collection (anteriormente cacheTime)
    refetchOnMount: true, // Refetchear cuando el componente se monta si los datos están stale
    placeholderData: (previousData) => previousData, // Mantener datos anteriores mientras se cargan nuevos para evitar re-renders bruscos
  });
}
