import { useEffect, useState } from "react";

import { getMonthlyReport } from "../services/reportService";

function useMonthlyReport() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await getMonthlyReport();

      setData(response);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    error,
  };
}

export default useMonthlyReport;
