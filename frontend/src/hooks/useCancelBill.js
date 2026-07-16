import { useState } from "react";

import { cancelBill } from "../services/cancelBillService";

function useCancelBill() {
  const [loading, setLoading] = useState(false);

  const submitCancel = async (data) => {
    try {
      setLoading(true);

      return await cancelBill(data);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitCancel,
  };
}

export default useCancelBill;
