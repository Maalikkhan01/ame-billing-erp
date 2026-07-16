import { useState } from "react";

import { receivePayment } from "../services/paymentService";

function usePayment() {
  const [loading, setLoading] = useState(false);

  const submitPayment = async (data) => {
    try {
      setLoading(true);

      return await receivePayment(data);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitPayment,
  };
}

export default usePayment;
