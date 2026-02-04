/**
 * Currency utilities for PEN (Peruvian Sol)
 */

export const CURRENCY_SYMBOL = 'S/';
export const CURRENCY_CODE = 'PEN';

/**
 * Format a number as Peruvian Sol currency
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, decimals: number = 2): string {
  return `${CURRENCY_SYMBOL}${amount.toFixed(decimals)}`;
}

/**
 * Format a number as Peruvian Sol currency with thousands separator
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string with thousands separator
 */
export function formatCurrencyWithSeparator(
  amount: number,
  decimals: number = 2
): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Parse currency string to number
 * @param currencyString - Currency string like "S/10.50" or "10.50"
 * @returns Parsed number
 */
export function parseCurrency(currencyString: string): number {
  const cleanString = currencyString.replace(/[S\/\s,]/g, '');
  return parseFloat(cleanString) || 0;
}
