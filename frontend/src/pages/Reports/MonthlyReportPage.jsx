import MainLayout from "../../components/layout/MainLayout";

import useMonthlyReport from "../../hooks/useMonthlyReport";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import "./MonthlyReportPage.css";
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
      <PageHeader title="Monthly Report" subtitle="Current month overview" />

      <div className="monthly-report-grid">
        <StatCard
          title="Sales"
          value={`₹${Number(summary.totalSales).toLocaleString("en-IN")}`}
        />

        <StatCard
          title="Collection"
          value={`₹${Number(summary.totalCollection).toLocaleString("en-IN")}`}
        />

        <StatCard
          title="Due Sale"
          value={`₹${Number(summary.totalDue).toLocaleString("en-IN")}`}
        />

        <StatCard title="Total Bills" value={summary.totalBills} />
      </div>
    </MainLayout>
  );
}

export default MonthlyReportPage;
