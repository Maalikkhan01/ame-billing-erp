import { useState, useEffect, useCallback } from "react";

import { getBillById } from "../services/billService";

function useBillDetails(id) {
  const [loading, setLoading] = useState(true);

  const [bill, setBill] = useState(null);

  const [error, setError] = useState("");

  const loadBill = useCallback(async () => {
    try {
      setLoading(true);

      setError("");

      const data = await getBillById(id);

      setBill(data);
    } catch (err) {
      console.error("Bill Details Error:", err);

      setError(
        err.response?.data?.message || err.message || "Failed to load bill",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadBill();
    }
  }, [id, loadBill]);

  return {
    loading,
    bill,
    error,
    refreshBill: loadBill,
  };
}

export default useBillDetails;
