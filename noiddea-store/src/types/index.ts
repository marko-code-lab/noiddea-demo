// Tipos de Base de Datos SQLite - Definidos directamente sin Supabase

// ============================================
// Tipos Base de Tablas
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar_url: string | null;
  created_at?: string;
  benefit?: number | null;
  // Mantener compatibilidad con el formato de Supabase User
  user_metadata?: {
    name?: string;
    phone?: string;
  };
}

export interface Business {
  id: string;
  name: string;
  tax_id: string;
  description: string | null;
  category: string | null;
  website: string | null;
  theme: string | null;
  location: string | null;
  created_at: string;
}

export interface Branch {
  id: string;
  business_id: string;
  name: string;
  location: string;
  phone: string | null;
  created_at: string;
}

export interface Supplier {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  ruc: string | null;
  address: string | null;
  is_active: number;
  created_at: string;
}

export interface BusinessUser {
  id: string;
  business_id: string;
  user_id: string;
  role: 'owner';
  is_active: number;
  created_at: string;
}

export interface BranchUser {
  id: string;
  branch_id: string;
  user_id: string;
  role: 'cashier';
  is_active: number;
  benefit: number | null;
  created_at: string;
}

export interface Product {
  id: string;
  branch_id: string;
  name: string;
  description: string | null;
  barcode: string | null;
  sku: string | null;
  brand: string | null;
  cost: number;
  price: number;
  stock: number | null;
  bonification: number | null;
  expiration: string | null;
  is_active: number;
  created_by_user_id: string | null;
  created_by_branch_id: string | null;
  created_at: string;
}

export interface ProductPresentation {
  id: string;
  product_id: string;
  variant: string;
  units: number;
  price: number | null;
  is_active: number;
  created_at: string;
}

export interface Sale {
  id: string;
  branch_id: string;
  user_id: string;
  customer: string | null;
  payment_method: 'cash' | 'card' | 'transfer' | 'digital_wallet';
  status: 'completed' | 'pending' | 'cancelled';
  total: number;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_presentation_id: string;
  quantity: number;
  unit_price: number;
  bonification: number | null;
  subtotal: number | null;
}

export interface Purchase {
  id: string;
  business_id: string;
  branch_id: string | null;
  supplier_id: string;
  created_by: string;
  approved_by: string | null;
  type: string;
  status: string;
  total: number;
  notes: string | null;
  created_at: string;
  approved_at: string | null;
  received_at: string | null;
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_presentation_id: string;
  quantity: number;
  unit_cost: number;
  subtotal: number | null;
}

export interface UserSession {
  id: string;
  user_id: string;
  branch_id: string;
  total_sales: number;
  total_bonus: number;
  payment_totals: string; // JSON string
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

// ============================================
// Tipos para Inserción
// ============================================

export type UserInsert = Omit<User, 'created_at'>;
export type BusinessInsert = Omit<Business, 'id' | 'created_at'>;
export type BranchInsert = Omit<Branch, 'id' | 'created_at'>;
export type SupplierInsert = Omit<Supplier, 'id' | 'created_at'>;
export type BusinessUserInsert = Omit<BusinessUser, 'id' | 'created_at'>;
export type BranchUserInsert = Omit<BranchUser, 'id' | 'created_at'>;
export type ProductInsert = Omit<Product, 'id' | 'created_at'>;
export type ProductPresentationInsert = Omit<ProductPresentation, 'id' | 'created_at'>;
export type SaleInsert = Omit<Sale, 'id' | 'created_at'>;
export type SaleItemInsert = Omit<SaleItem, 'id'>;
export type PurchaseInsert = Omit<Purchase, 'id' | 'created_at'>;
export type PurchaseItemInsert = Omit<PurchaseItem, 'id'>;

// ============================================
// Tipos para Actualización
// ============================================

export type UserUpdate = Partial<Omit<User, 'id' | 'created_at'>>;
export type BusinessUpdate = Partial<Omit<Business, 'id' | 'created_at'>>;
export type BranchUpdate = Partial<Omit<Branch, 'id' | 'created_at'>>;
export type SupplierUpdate = Partial<Omit<Supplier, 'id' | 'created_at'>>;
export type BusinessUserUpdate = Partial<Omit<BusinessUser, 'id' | 'created_at'>>;
export type BranchUserUpdate = Partial<Omit<BranchUser, 'id' | 'created_at'>>;
export type ProductUpdate = Partial<Omit<Product, 'id' | 'created_at'>>;
export type ProductPresentationUpdate = Partial<Omit<ProductPresentation, 'id' | 'created_at'>>;
export type SaleUpdate = Partial<Omit<Sale, 'id' | 'created_at'>>;
export type SaleItemUpdate = Partial<Omit<SaleItem, 'id'>>;
export type PurchaseUpdate = Partial<Omit<Purchase, 'id' | 'created_at'>>;
export type PurchaseItemUpdate = Partial<Omit<PurchaseItem, 'id'>>;

// ============================================
// Enums
// ============================================

export type BusinessUserRole = 'owner';
export type BranchUserRole = 'cashier';
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'digital_wallet';
export type SaleStatus = 'completed' | 'pending' | 'cancelled';

// ============================================
// Tipos Extendidos
// ============================================

export interface UserWithBusiness extends User {
  business_user?: BusinessUser & {
    business?: Business;
  };
}

export interface UserWithBranch extends User {
  branch_user?: BranchUser & {
    branch?: Branch;
  };
}

export interface BusinessWithRelations extends Business {
  business_users?: (BusinessUser & { user?: User })[];
  branches?: Branch[];
}

export interface BranchWithRelations extends Branch {
  branch_users?: (BranchUser & { user?: User })[];
  suppliers?: Supplier[];
  business?: Business;
}

export interface BranchUserWithUser extends BranchUser {
  user?: User;
}

export interface ProductWithPresentations extends Product {
  product_presentations?: ProductPresentation[];
  business?: Business;
  created_by_branch?: Branch;
  created_by_user?: User;
}

export interface ProductPresentationWithProduct extends ProductPresentation {
  product?: Product;
}

export interface SaleWithItems extends Sale {
  sale_items?: (SaleItem & {
    product_presentation?: ProductPresentation & {
      product?: Product;
    };
  })[];
  branch?: Branch;
  user?: User;
}

export interface PurchaseWithItems extends Purchase {
  purchase_items?: (PurchaseItem & {
    product_presentation?: ProductPresentation & {
      product?: Product;
    };
  })[];
  supplier?: Supplier;
  business?: Business;
  branch?: Branch;
  created_by_user?: User;
  approved_by_user?: User;
}

// ============================================
// Tipos de API
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// ============================================
// Tipos de Paginación
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================
// Tipos de Filtros
// ============================================

export interface FilterParams {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  dateFrom?: string;
  dateTo?: string;
}

export interface SupplierFilters extends FilterParams {
  branchId?: string;
}

export interface UserFilters extends FilterParams {
  role?: BusinessUserRole | BranchUserRole;
  businessId?: string;
  branchId?: string;
}

export interface ProductFilters extends FilterParams {
  businessId?: string;
  branchId?: string;
  brand?: string;
}

export interface SaleFilters extends FilterParams {
  branchId?: string;
  userId?: string;
  paymentMethod?: PaymentMethod;
  salesStatus?: SaleStatus;
}

export interface PurchaseFilters extends FilterParams {
  businessId?: string;
  branchId?: string;
  supplierId?: string;
  purchaseStatus?: string;
  type?: string;
}

// ============================================
// Tipos de Estadísticas y Reportes
// ============================================

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  salesByPaymentMethod: Record<PaymentMethod, number>;
  salesByStatus: Record<SaleStatus, number>;
  topSellingProducts: {
    product: ProductPresentation;
    quantity: number;
    revenue: number;
  }[];
}

export interface ProductStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
}

export interface PurchaseStats {
  totalPurchases: number;
  totalSpent: number;
  averagePurchaseValue: number;
  purchasesBySupplier: Record<string, number>;
  pendingPurchases: number;
}

export interface DashboardStats {
  sales: SalesStats;
  products: ProductStats;
  purchases: PurchaseStats;
}

// ============================================
// Tipos de Formularios
// ============================================

export interface CreateSaleForm {
  branchId: string;
  userId: string;
  customer?: string;
  paymentMethod: PaymentMethod;
  items: {
    productPresentationId: string;
    quantity: number;
    unitPrice: number;
    bonus?: number;
  }[];
}

export interface CreatePurchaseForm {
  businessId: string;
  branchId?: string;
  supplierId: string;
  type: string;
  notes?: string;
  items: {
    productPresentationId: string;
    quantity: number;
    unitCost: number;
  }[];
}

export interface CreateProductForm {
  businessId: string;
  name: string;
  description?: string;
  expiration?: string;
  brand?: string;
  barcode?: string;
  sku?: string;
  presentations: {
    name: string;
    unit?: string;
    cost?: number;
    price?: number;
    barcode?: string;
    sku?: string;
  }[];
}

// ============================================
// Tipos de Carrito
// ============================================

export interface CartProductPresentation {
  id: string;
  variant: string;
  units: number;
  price: number | null;
}

export interface CartProduct {
  id: string;
  name: string;
  brand: string;
  description: string;
  image: string;
  stock: number;
  basePrice: number | null;
  baseCost: number | null;
  bonification: number | null;
  expiration: string | null;
  presentations: CartProductPresentation[];
  quantity: number;
  selectedPresentationId?: string;
}

// ============================================
// Tipos de Pagos
// ============================================

export interface PaymentTotals {
  cash: number;
  card: number;
  transfer: number;
  digital_wallet: number;
}
