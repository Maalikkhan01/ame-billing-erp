import { useEffect, useState } from "react";

import {
  getCustomers,
} from "../services/customerService";

function useCustomerOptions() {

  const [customers,
    setCustomers] =
    useState([]);

  useEffect(() => {

    const load =
      async () => {

        const data =
          await getCustomers();

        setCustomers(
          data.customers
        );
      };

    load();

  }, []);

  return customers;
}

export default useCustomerOptions;