import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

function useDashboard() {
  const [loading, setLoading] =
    useState(true);

  const [dashboard, setDashboard] =
    useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchDashboard();
  }, []);

  const fetchDashboard =
    async () => {
      try {
        const data =
          await getDashboard();

        setDashboard(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

  return {
    loading,
    dashboard,
    error,
    refresh:
      fetchDashboard,
  };
}

export default useDashboard;