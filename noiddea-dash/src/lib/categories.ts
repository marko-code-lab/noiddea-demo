/**
 * Diccionario de categorías de productos
 * 
 * Este archivo contiene las categorías disponibles para los productos.
 * Las categorías se almacenan con su valor (key) y su etiqueta (label) para mostrar.
 */

export interface Category {
  value: string;
  label: string;
}

/**
 * Lista de categorías disponibles
 */
export const PRODUCT_CATEGORIES: Category[] = [
  { value: 'alimentos', label: 'Alimentos' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'limpieza', label: 'Limpieza' },
  { value: 'higiene', label: 'Higiene Personal' },
  { value: 'cuidado', label: 'Cuidado Personal' },
  { value: 'hogar', label: 'Hogar' },
  { value: 'medicamentos', label: 'Medicamentos' },
  { value: 'general', label: 'General' },
];

/**
 * Diccionario para búsqueda rápida de categorías por valor
 */
export const CATEGORIES_DICT: Record<string, string> = PRODUCT_CATEGORIES.reduce(
  (acc, category) => {
    acc[category.value] = category.label;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Obtiene la etiqueta de una categoría por su valor
 * @param value - Valor de la categoría
 * @returns Etiqueta de la categoría o el valor si no se encuentra
 */
export function getCategoryLabel(value: string | null | undefined): string {
  if (!value) return '-';
  return CATEGORIES_DICT[value] || value;
}

/**
 * Verifica si una categoría existe
 * @param value - Valor de la categoría a verificar
 * @returns true si la categoría existe, false en caso contrario
 */
export function isValidCategory(value: string | null | undefined): boolean {
  if (!value) return false;
  return value in CATEGORIES_DICT;
}

