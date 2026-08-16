import { useCallback, useState } from "react";

import { getProfitReport } from "../services/reportService";

function useProfitReport() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const loadReport = useCallback(async (fromDate, toDate) => {
    try {
      setLoading(true);
      setError("");

      const data = await getProfitReport(fromDate, toDate);

      setReport(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load profit report",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    report,
    error,
    loadReport,
  };
}

export default useProfitReport;
