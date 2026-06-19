import { useState } from "react";

import { receivePayment } from "../services/paymentService";

export const useReceivePayment = () => {
  const [loading, setLoading] = useState(false);

  const submitPayment = async (paymentData) => {
    try {
      setLoading(true);

      const data = await receivePayment(paymentData);

      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitPayment,
    loading,
  };
};
