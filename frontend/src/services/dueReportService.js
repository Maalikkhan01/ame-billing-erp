import api from "./api";

export const getDueReport = async () => {
  const response = await api.get("/reports/due");

  return response.data;
};
