import { useEffect, useState } from "react";

import {
  getCustomers,
  createCustomer,
  searchCustomers,
  updateCustomer,
  deleteCustomer,
} from "../services/customerService";

function useCustomers() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const loadCustomers = async (pageNo = 1) => {
    try {
      const data = await getCustomers(pageNo);

      setCustomers(data.customers);

      setPage(data.page);

      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const addCustomer = async (customerData) => {
    await createCustomer(customerData);

    await loadCustomers(page);
  };

  const searchCustomer = async (keyword) => {
    const data = await searchCustomers(keyword);

    setCustomers(data.customers);
  };

  const editCustomer = async (id, customerData) => {
    await updateCustomer(id, customerData);

    await loadCustomers(page);
  };

  const removeCustomer = async (id) => {
    await deleteCustomer(id);

    await loadCustomers(page);
  };

  return {
    customers,
    loading,
    page,
    totalPages,

    loadCustomers,

    addCustomer,

    searchCustomer,

    editCustomer,

    removeCustomer,
  };
}

export default useCustomers;
