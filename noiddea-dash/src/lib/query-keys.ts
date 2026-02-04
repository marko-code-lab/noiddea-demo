/**
 * Query Keys Factory
 * Centraliza todas las keys de TanStack Query para mejor mantenimiento
 */

export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
  },

  // Business
  business: {
    all: ['business'] as const,
    detail: (id: string) => ['business', id] as const,
    current: ['business', 'current'] as const,
  },

  // Branches
  branches: {
    all: ['branches'] as const,
    byBusiness: (businessId: string) =>
      ['branches', 'business', businessId] as const,
    detail: (id: string) => ['branches', id] as const,
  },

  // Products
  products: {
    all: ['products'] as const,
    byBusiness: (businessId: string) =>
      ['products', 'business', businessId] as const,
    detail: (id: string) => ['products', id] as const,
    search: (query: string) => ['products', 'search', query] as const,
  },

  // Suppliers
  suppliers: {
    all: ['suppliers'] as const,
    byBusiness: (businessId: string) =>
      ['suppliers', 'business', businessId] as const,
    detail: (id: string) => ['suppliers', id] as const,
  },

  // Products by Branch (replaces Inventory)
  branchProducts: {
    all: (branchId: string) => ['products', 'branch', branchId] as const,
    lowStock: (branchId: string) =>
      ['products', 'branch', branchId, 'low-stock'] as const,
    outOfStock: (branchId: string) =>
      ['products', 'branch', branchId, 'out-of-stock'] as const,
    stats: (branchId: string) => ['products', 'branch', branchId, 'stats'] as const,
    detail: (branchId: string, productId: string) =>
      ['products', 'branch', branchId, 'product', productId] as const,
  },

  // Purchases
  purchases: {
    all: ['purchases'] as const,
    byBusiness: (businessId: string) =>
      ['purchases', 'business', businessId] as const,
    byBranch: (branchId: string) => ['purchases', 'branch', branchId] as const,
    detail: (id: string) => ['purchases', id] as const,
    stats: (businessId: string) => ['purchases', 'stats', businessId] as const,
  },

  // Sales
  sales: {
    all: ['sales'] as const,
    byBranch: (branchId: string) => ['sales', 'branch', branchId] as const,
    detail: (id: string) => ['sales', id] as const,
  },

  // Sessions
  sessions: {
    all: ['sessions'] as const,
    byBranch: (branchId?: string) => branchId ? ['sessions', 'branch', branchId] as const : ['sessions', 'all'] as const,
    sales: (userId: string, branchId: string) => ['sessions', 'sales', userId, branchId] as const,
    active: (userId: string, branchId: string) => ['sessions', 'active', userId, branchId] as const,
  },

  // Team/Users
  team: {
    all: ['team'] as const,
    byBusiness: (businessId: string) =>
      ['team', 'business', businessId] as const,
    managers: (businessId: string) => ['team', 'managers', businessId] as const,
    admins: (businessId: string) => ['team', 'admins', businessId] as const,
  },
  // Branch Users (relación usuario-sucursal)
  branchUsers: {
    all: ['branchUsers'] as const,
    byUser: (userId: string) => ['branchUsers', 'user', userId] as const,
    byBranch: (branchId: string) => ['branchUsers', 'branch', branchId] as const,
    detail: (userId: string, branchId: string) =>
      ['branchUsers', 'user', userId, 'branch', branchId] as const,
    benefit: (userId: string, branchId: string) =>
      ['branchUsers', 'user', userId, 'branch', branchId, 'benefit'] as const,
  },
} as const;
