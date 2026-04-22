/**
 * Format a numeric amount into a currency string.
 * Defaults to INR (₹) since the prompt references ₹ badges.
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Returns a display-friendly fee label.
 */
export function formatFee(fee: number): string {
  if (fee === 0) return 'FREE';
  return formatCurrency(fee);
}
