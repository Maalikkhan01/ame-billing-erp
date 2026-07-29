/**
 * ===========================================
 * AME ERP Accounting Utility
 * ===========================================
 * Single source of truth for all accounting
 * calculations.
 *
 * NEVER use Math.ceil(), rate * qty,
 * subtotal calculations directly anywhere
 * else in the project.
 * ===========================================
 */

/**
 * Validate Rate
 * Max 1 decimal place
 */
const validateRate = (rate) => {
  const value = Number(rate);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Invalid rate");
  }

  if (!/^\d+(\.\d{1})?$/.test(String(rate))) {
    throw new Error("Rate can have maximum 1 decimal place");
  }

  return value;
};

/**
 * Validate Quantity
 * Max 3 decimal places
 */
const validateQuantity = (qty) => {
  const value = Number(qty);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Invalid quantity");
  }

  if (!/^\d+(\.\d{1,3})?$/.test(String(qty))) {
    throw new Error("Quantity can have maximum 3 decimal places");
  }

  return value;
};

/**
 * Calculate Item Amount
 * No rounding here.
 */
const calculateLineAmount = (rate, qty) => {
  return Number((Number(rate) * Number(qty)).toFixed(3));
};

/**
 * Calculate Bill Subtotal
 */
const calculateSubtotal = (items = []) => {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return Number(subtotal.toFixed(3));
};

/**
 * Business Rule
 * Always Ceiling
 */
const calculateGrandTotal = (subtotal) => {
  return Math.ceil(Number(subtotal));
};

/**
 * Round Off
 */
const calculateRoundOff = (
  subtotal,
  grandTotal
) => {
  return Number(
    (grandTotal - subtotal).toFixed(3)
  );
};

/**
 * Due
 */
const calculateDue = (
  grandTotal,
  paidAmount
) => {
  return Number(
    (grandTotal - Number(paidAmount)).toFixed(3)
  );
};

module.exports = {
  validateRate,
  validateQuantity,
  calculateLineAmount,
  calculateSubtotal,
  calculateGrandTotal,
  calculateRoundOff,
  calculateDue,
};