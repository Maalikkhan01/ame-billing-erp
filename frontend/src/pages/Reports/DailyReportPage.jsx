import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/ui/StatCard";

import useDashboard from "../../hooks/useDashboard";
import PageHeader from "../../components/ui/PageHeader";
import "./DailyReportPage.css";

function DailyReportPage() {
  const { loading, dashboard } = useDashboard();

  if (loading) {
    return (
      <MainLayout>
        <h2>Loading...</h2>
      </MainLayout>
    );
  }

  const summary = dashboard.summary;

  return (
    <MainLayout>
      <div className="daily-report-page">
        <PageHeader title="Daily Report" subtitle="Today's sales summary" />

        <div className="daily-report-grid">
          <StatCard
            title="Today's Sales"
            value={`₹${Number(summary.totalSales).toLocaleString("en-IN")}`}
          />

          <StatCard
            title="Collection"
            value={`₹${Number(summary.totalCollection).toLocaleString(
              "en-IN",
            )}`}
          />

          <StatCard
            title="Due Sale"
            value={`₹${Number(summary.totalDue).toLocaleString("en-IN")}`}
          />

          <StatCard title="Total Bills" value={summary.totalBills} />
        </div>
      </div>
    </MainLayout>
  );
}

export default DailyReportPage;
