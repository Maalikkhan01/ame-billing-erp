import api from "./api";

export const getProducts = async (page = 1) => {
  const response = await api.get(`/products?page=${page}`);

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
