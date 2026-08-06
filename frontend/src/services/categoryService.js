import api from "./api";

// =========================================
// GET ALL CATEGORIES
// =========================================
export const getCategories = async (params = {}) => {
  const query = {};

  if (params.keyword?.trim()) {
    query.keyword = params.keyword.trim();
  }

  if (
    params.active !== undefined &&
    params.active !== null &&
    params.active !== ""
  ) {
    query.active = params.active;
  }

  const { data } = await api.get("/categories", {
    params: query,
  });

  return data;
};

// =========================================
// SEARCH CATEGORIES
// (Uses the same endpoint with keyword filter)
// =========================================
export const searchCategories = async (keyword = "") => {
  return getCategories({
    keyword,
  });
};

// =========================================
// GET CATEGORY BY ID
// =========================================
export const getCategoryById = async (id) => {
  const { data } = await api.get(`/categories/${id}`);

  return data;
};

// =========================================
// CREATE CATEGORY
// =========================================
export const createCategory = async (categoryData) => {
  const { data } = await api.post(
    "/categories",
    categoryData
  );

  return data;
};

// =========================================
// UPDATE CATEGORY
// =========================================
export const updateCategory = async (
  id,
  categoryData,
) => {
  const { data } = await api.put(
    `/categories/${id}`,
    categoryData,
  );

  return data;
};

// =========================================
// DELETE CATEGORY (Soft Delete)
// =========================================
export const deleteCategory = async (id) => {
  const { data } = await api.delete(
    `/categories/${id}`,
  );

  return data;
};

// =========================================
// DEFAULT EXPORT (OPTIONAL)
// =========================================
const categoryService = {
  getCategories,
  searchCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;