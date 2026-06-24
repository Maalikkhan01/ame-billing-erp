import { useEffect, useState } from "react";

import {
  getActivityLogs,
  getLoginHistory,
} from "../../services/securityService";

import MainLayout from "../../components/layout/MainLayout";

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
      <h1>Security Center</h1>

      <br />

      <div className="dashboard-card">
        <h2>Activity Logs</h2>

        <table className="dashboard-table">
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
      </div>

      <br />

      <div className="dashboard-card">
        <h2>Login History</h2>

        <table className="dashboard-table">
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
      </div>
    </MainLayout>
  );
}

export default SecurityPage;
