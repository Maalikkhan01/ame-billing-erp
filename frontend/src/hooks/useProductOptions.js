import { useEffect, useState } from "react";

import { getProducts } from "../services/productService";

function useProductOptions() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getProducts();

      setProducts(data.products);
    };

    load();
  }, []);

  return products;
}

export default useProductOptions;
