import { useState } from "react";

import { getRangeReport } from "../services/rangeReportService";

function useRangeReport() {
  const [loading, setLoading] = useState(false);

  const [report, setReport] = useState(null);

  const loadReport = async (
    fromDate,
    toDate
  ) => {
    try {
      setLoading(true);

      const data =
        await getRangeReport(
          fromDate,
          toDate
        );

      setReport(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    report,
    loadReport,
  };
}

export default useRangeReport;