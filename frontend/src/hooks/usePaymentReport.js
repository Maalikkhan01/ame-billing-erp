import { useCallback, useState } from "react";

import { getPaymentReport } from "../services/reportService";

function usePaymentReport() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const loadReport = useCallback(async (date = "") => {
    try {
      setLoading(true);
      setError("");

      const data = await getPaymentReport(date);

      setReport(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load payment report",
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

export default usePaymentReport;
