import { useState } from "react";

import { createAdjustment } from "../services/adjustmentService";

function useAdjustment() {
  const [loading, setLoading] = useState(false);

  const submitAdjustment = async (data) => {
    try {
      setLoading(true);

      return await createAdjustment(data);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitAdjustment,
  };
}

export default useAdjustment;
