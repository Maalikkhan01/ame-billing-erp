import MainLayout from "../../components/layout/MainLayout";

import useMonthlyReport from "../../hooks/useMonthlyReport";

function MonthlyReportPage() {
  const { loading, data, error } = useMonthlyReport();

  if (loading) {
    return (
      <MainLayout>
        <h2>Loading...</h2>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <h2>{error}</h2>
      </MainLayout>
    );
  }

  const summary = data.summary;

  return (
    <MainLayout>
      <h1>Monthly Report</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Sales</h3>

          <h2>₹{summary.totalSales}</h2>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Collection</h3>

          <h2>₹{summary.totalCollection}</h2>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Due Sale</h3>

          <h2>₹{summary.totalDue}</h2>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Total Bills</h3>

          <h2>{summary.totalBills}</h2>
        </div>
      </div>
    </MainLayout>
  );
}

export default MonthlyReportPage;
