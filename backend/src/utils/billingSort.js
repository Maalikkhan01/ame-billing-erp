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

const sortBillingItems = (items = []) => {
  return [...items].sort((a, b) => {
    const unitCompare =
      (UNIT_ORDER[a.units?.[0]?.type] ?? 999) -
      (UNIT_ORDER[b.units?.[0]?.type] ?? 999);

    if (unitCompare !== 0) {
      return unitCompare;
    }

    const categoryCompare =
      (a.categorySortOrder ?? 9999) -
      (b.categorySortOrder ?? 9999);

    if (categoryCompare !== 0) {
      return categoryCompare;
    }

    const categoryNameCompare = (a.category || "").localeCompare(
      b.category || "",
    );

    if (categoryNameCompare !== 0) {
      return categoryNameCompare;
    }

    return (a.name || "").localeCompare(b.name || "");
  });
};

module.exports = {
  sortBillingItems,
};