import { useEffect, useState } from "react";

import {
  getProducts,
  createProduct,
  searchProducts,
} from "../services/productService";

function useProducts() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const loadProducts = async (pageNo = 1) => {
    try {
      const data = await getProducts(pageNo);

      setProducts(data.products);
      setTotalProducts(data.totalProducts);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
  }, []);

  const addProduct = async (productData) => {
    await createProduct(productData);

    await loadProducts(page);
  };
  const searchProductList = async (keyword) => {
    try {
      if (!keyword.trim()) {
        await loadProducts();
        return;
      }

      const data = await searchProducts(keyword);

      setProducts(data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    products,
    loading,
    addProduct,
    searchProductList,

    page,
    totalPages,
    totalProducts,
    loadProducts,
  };
}

export default useProducts;
