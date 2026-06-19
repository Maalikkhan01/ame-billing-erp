import { useEffect, useState } from "react";
import { getBills } from "../services/billService";

function useBills() {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    loadBills(1, "");
  }, []);

  const loadBills = async (pageNo = 1, keyword = "") => {
    try {
      setError("");

      const data = await getBills(pageNo, keyword);

      console.log("Bills API Response:", data);

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
  };

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
