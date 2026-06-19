import { useEffect, useState } from "react";

import { getProductById } from "../services/productService";

function useProductProfile(id) {
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);

      setProduct(data.product);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  return {
    product,
    loading,
    refreshProduct: loadProduct,
  };
}

export default useProductProfile;
