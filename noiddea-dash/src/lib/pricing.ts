/**
 * Utilidades para cálculo de precios de productos por sucursal
 * Ahora los productos tienen precio y costo directamente asociados al branch
 */

import type { Product, ProductPresentation } from '@/types';

/**
 * Calcula el precio final de venta
 * Prioridad: precio de presentación > precio del producto
 */
export function getFinalPrice(
  product: Product,
  presentation?: ProductPresentation | null
): number {
  return presentation?.price ?? product.price ?? 0;
}

/**
 * Calcula el costo final de compra
 * Solo del producto (las presentaciones no tienen costo)
 */
export function getFinalCost(product: Product): number {
  return product.cost ?? 0;
}

/**
 * Calcula el margen de ganancia
 */
export function getProfit(
  product: Product,
  presentation?: ProductPresentation | null
): number {
  const price = getFinalPrice(product, presentation);
  const cost = getFinalCost(product);
  return price - cost;
}

/**
 * Calcula el porcentaje de margen
 */
export function getProfitMargin(
  product: Product,
  presentation?: ProductPresentation | null
): number {
  const price = getFinalPrice(product, presentation);
  const cost = getFinalCost(product);

  if (cost === 0) return 0;

  return ((price - cost) / cost) * 100;
}

/**
 * Verifica si la presentación tiene precio personalizado
 */
export function hasCustomPricing(
  product: Product,
  presentation?: ProductPresentation | null
): boolean {
  return !!(presentation?.price && presentation.price !== product.price);
}

/**
 * Calcula el valor total del stock
 */
export function getStockValue(product: Product): number {
  const stock = product.stock ?? 0;
  const price = product.price ?? 0;
  return stock * price;
}

/**
 * Calcula el costo total del stock
 */
export function getStockCost(product: Product): number {
  const stock = product.stock ?? 0;
  const cost = product.cost ?? 0;
  return stock * cost;
}

/**
 * Verifica si el producto tiene stock bajo
 * (Puedes ajustar el threshold según tu lógica de negocio)
 */
export function isLowStock(product: Product, threshold: number = 10): boolean {
  const stock = product.stock ?? 0;
  return stock > 0 && stock <= threshold;
}

/**
 * Verifica si el producto está sin stock
 */
export function isOutOfStock(product: Product): boolean {
  return (product.stock ?? 0) <= 0;
}
