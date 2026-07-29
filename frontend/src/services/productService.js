import api from "./api";

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.append("page", params.page);

  if (params.keyword?.trim()) {
    query.append("keyword", params.keyword.trim());
  }

  if (params.category?.trim()) {
    query.append("category", params.category.trim());
  }

  if (params.brand?.trim()) {
    query.append("brand", params.brand.trim());
  }

  if (params.measurementType?.trim()) {
    query.append("measurementType", params.measurementType.trim());
  }

  if (params.active !== "" && params.active !== undefined) {
    query.append("active", params.active);
  }

  const response = await api.get(`/products?${query.toString()}`);

  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post("/products", data);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);

  return response.data;
};

export const searchProducts = async (keyword, signal) => {
  const response = await api.get(`/products/search?keyword=${keyword}`, {
    signal,
  });

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};
