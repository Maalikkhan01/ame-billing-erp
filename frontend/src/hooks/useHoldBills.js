import { useEffect, useState } from "react";

import { getHoldBills, deleteHoldBill } from "../services/holdBillService";

function useHoldBills() {
  const [loading, setLoading] = useState(true);

  const [holdBills, setHoldBills] = useState([]);

  const [error, setError] = useState("");

  const loadHoldBills = async () => {
    try {
      const data = await getHoldBills();

      setHoldBills(data.holdBills || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load hold bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHoldBills();
  }, []);

  const removeHoldBill = async (id) => {
    try {
      await deleteHoldBill(id);

      setHoldBills((prev) => prev.filter((bill) => bill._id !== id));
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Failed to delete hold bill");
    }
  };

  return {
    loading,
    holdBills,
    error,
    removeHoldBill,
    reload: loadHoldBills,
  };
}

export default useHoldBills;
