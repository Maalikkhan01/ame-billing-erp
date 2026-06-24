import api from "./api";

export const getActivityLogs = async () => {
  const response = await api.get(
    "/security/activity-logs"
  );

  return response.data;
};

export const getLoginHistory = async () => {
  const response = await api.get(
    "/security/login-history"
  );

  return response.data;
};