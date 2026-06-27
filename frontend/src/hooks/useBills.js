import { useEffect, useState, useCallback } from "react";
import { getBills } from "../services/billService";

function useBills() {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadBills = useCallback(async (pageNo = 1, keyword = "") => {
    try {
      setError("");

      const data = await getBills(pageNo, keyword);

      setBills(data.bills || []);

      setPage(data.page || 1);

      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.log("Bills Error:", err);

      setError(
        err.response?.data?.message || err.message || "Failed to load bills",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBills(1, "");
  }, [loadBills]);

  return {
    loading,
    bills,
    error,
    page,
    totalPages,
    loadBills,
  };
}

export default useBills;
