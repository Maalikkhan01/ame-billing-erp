import api from "./api";

// Dashboard Summary
export const getDashboard = async () => {
  const response = await api.get("/reports/dashboard");

  return response.data;
};

// Due Report
export const getDueReport = async () => {
  const response = await api.get("/reports/due");

  return response.data;
};

// Monthly Report
export const getMonthlyReport = async () => {
  const response = await api.get("/reports/monthly");

  return response.data;
};

// Payment Report
export const getPaymentReport = async (date) => {
  const response = await api.get("/reports/payments", {
    params: date ? { date } : {},
  });

  return response.data;
};

// Profit Report
export const getProfitReport = async (fromDate, toDate) => {
  const response = await api.get("/reports/profit", {
    params: {
      fromDate,
      toDate,
    },
  });

  return response.data;
};
