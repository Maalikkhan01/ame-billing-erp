const UNIT_ORDER = {
  PIECE: 1,
  Ladi: 2,
  PACKET: 3,
  GRAM: 4,
  KG: 5,
  SET: 6,
  Jar: 7,
  OUTER: 8,
  BOX: 9,
  BAG: 10,
};

export function sortBillingItems(items = []) {
  return [...items].sort((a, b) => {
    // 1. Unit Order
    const unitCompare =
      (UNIT_ORDER[a.unitType] ?? 999) - (UNIT_ORDER[b.unitType] ?? 999);

    if (unitCompare !== 0) {
      return unitCompare;
    }

    // 2. Category Sort Order
    const categoryCompare =
      (a.categorySortOrder ?? 9999) - (b.categorySortOrder ?? 9999);

    if (categoryCompare !== 0) {
      return categoryCompare;
    }

    // 3. Category Name
    const categoryNameCompare = (a.category || "").localeCompare(
      b.category || "",
    );

    if (categoryNameCompare !== 0) {
      return categoryNameCompare;
    }

    // 4. Product Name
    return (a.productName || "").localeCompare(b.productName || "");
  });
}
