import api from "./api";

// Get All Categories
export const getCategories = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.keyword?.trim()) {
    query.append("keyword", params.keyword.trim());
  }

  if (params.active !== "" && params.active !== undefined) {
    query.append("active", params.active);
  }

  const response = await api.get(`/categories?${query.toString()}`);

  return response.data;
};

// Search Categories
export const searchCategories = async (keyword, signal) => {
  const response = await api.get(`/categories/search?keyword=${keyword}`, {
    signal,
  });

  return response.data;
};

// Create Category
export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);

  return response.data;
};

// Update Category
export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);

  return response.data;
};

// Get Category By Id
export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);

  return response.data;
};

// Delete Category
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);

  return response.data;
};
