/**
 * Round a numeric value to a specific number of decimal places.
 *
 * @param {number | string} n Value to round.
 * @param {number} [afterComma=2] Number of digits after the decimal point.
 * @returns {number} Rounded numeric value.
 */
export const round = (n: number | string, afterComma = 2) => {
  const num = Number(n);
  const roundedString = num.toFixed(afterComma);
  return Number(roundedString);
}
