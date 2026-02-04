import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache por 5 minutos
            staleTime: 5 * 60 * 1000,
            // Cache en memoria por 10 minutos
            gcTime: 10 * 60 * 1000,
            // Reintentar 1 vez en caso de error
            retry: 1,
            // No refetch automático en ventana focus (mejor para performance)
            refetchOnWindowFocus: false,
            // No refetch al reconectar (evitar múltiples requests)
            refetchOnReconnect: false,
            // No refetch al montar componentes (evitar recargas innecesarias)
            refetchOnMount: false,
          },
          mutations: {
            // Reintentar 1 vez en caso de error
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {typeof import.meta !== 'undefined' && import.meta.env?.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

