/**
 * AME ERP Invoice Print Size Rules
 *
 * A6:
 * - Maximum 10 actual items
 *
 * A5:
 * - 11+ items
 *
 * Later this utility will also receive the
 * actual rendered-content safety check.
 */

export const A6_MAX_ITEMS = 10;

export const INVOICE_PRINT_SIZES = {
  A6: "A6",
  A5: "A5",
};

export const getInvoicePrintRecommendation = (invoice) => {
  const itemCount = Array.isArray(invoice?.items)
    ? invoice.items.length
    : 0;

  if (itemCount === 0) {
    return {
      recommendedSize: INVOICE_PRINT_SIZES.A5,
      itemCount: 0,
      canUseA6: false,
      reason: "Invoice has no items.",
    };
  }

  if (itemCount > A6_MAX_ITEMS) {
    return {
      recommendedSize: INVOICE_PRINT_SIZES.A5,
      itemCount,
      canUseA6: false,
      reason: `This invoice contains ${itemCount} items. A6 supports a maximum of ${A6_MAX_ITEMS} items in the compact invoice format.`,
    };
  }

  return {
    recommendedSize: INVOICE_PRINT_SIZES.A6,
    itemCount,
    canUseA6: true,
    reason: `This invoice contains ${itemCount} item${
      itemCount === 1 ? "" : "s"
    } and is suitable for the A6 compact invoice format.`,
  };
};