import { useState } from "react";

import { createReturn } from "../services/returnService";

function useReturn() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const submitReturn = async (data) => {
    try {
      setLoading(true);

      setError("");

      const response = await createReturn(data);

      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Return failed");

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitReturn,
  };
}

export default useReturn;
