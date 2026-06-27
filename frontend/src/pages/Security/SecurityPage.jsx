import { useEffect, useState } from "react";

import {
  getActivityLogs,
  getLoginHistory,
} from "../../services/securityService";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import TableWrapper from "../../components/ui/TableWrapper";
import EmptyState from "../../components/ui/EmptyState";

import "./SecurityPage.css";

function SecurityPage() {
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const logsData = await getActivityLogs();

      const historyData = await getLoginHistory();

      setLogs(logsData.logs || []);

      setHistory(historyData.logs || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Security Center"
        subtitle="Activity logs and login history"
      />
      <div className="security-page">
        <Card title="Activity Logs">
          {logs.length === 0 ? (
            <EmptyState text="No Activity Logs Found" />
          ) : (
            <TableWrapper>
              <table className="app-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td>{log.userId?.name}</td>

                      <td>{log.action}</td>

                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrapper>
          )}
        </Card>
        <Card title="Login History">
          {history.length === 0 ? (
            <EmptyState text="No Login History Found" />
          ) : (
            <TableWrapper>
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr key={item._id}>
                      <td>{item.mobile}</td>

                      <td>{item.status}</td>

                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrapper>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

export default SecurityPage;
