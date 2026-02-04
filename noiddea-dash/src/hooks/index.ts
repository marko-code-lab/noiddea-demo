// Hooks de autenticación y datos
export { useAuth } from './use-auth';
export { useUser } from './use-user';
export { useBusiness } from './use-business';
export { useBranches } from './use-branches';
export { useSuppliers, useSupplier } from './use-suppliers';
export { usePurchases, usePurchase, usePurchaseStats } from './use-purchases';
export { useBranchUsers } from './use-branch-users';

// Hooks con TanStack Query (nuevos - preferidos)
export * from './use-products-query';
export * from './use-branches-query';
export * from './use-suppliers-query';
export * from './use-purchases-query';
export * from './use-sessions-query';

// Alias para compatibilidad - useProducts retorna ProductWithPresentations[] para la tabla
export { useProducts } from './use-products-query';

// Hooks de utilidad
export { useAsync } from './use-async';
export { useDebounce } from './use-debounce';
export { useUpdateCheck } from './use-update-check';

// Hook de contexto
export { useSelectedBranch } from './use-selected-branch';
export { useBusinessUsers } from './use-business-users';
