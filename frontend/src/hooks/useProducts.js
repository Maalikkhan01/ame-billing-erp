import { useEffect, useState } from "react";

import { getProducts, createProduct } from "../services/productService";

function useProducts() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    brand: "",
    measurementType: "",
    active: "",
  });

  const loadProducts = async (pageNo = 1, currentFilters = filters) => {
    try {
      setLoading(true);

      const data = await getProducts({
        page: pageNo,
        ...currentFilters,
      });

      setProducts(data.products);
      setTotalProducts(data.totalProducts ?? 0);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadProducts(1, filters);
    };

    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProduct = async (productData) => {
    await createProduct(productData);

    await loadProducts(page, filters);
  };

  const searchProductList = async (newFilters) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
    };

    setFilters(updatedFilters);

    await loadProducts(1, updatedFilters);
  };

  return {
    products,
    loading,
    addProduct,
    searchProductList,

    filters,
    setFilters,

    page,
    totalPages,
    totalProducts,
    loadProducts,
  };
}

export default useProducts;
