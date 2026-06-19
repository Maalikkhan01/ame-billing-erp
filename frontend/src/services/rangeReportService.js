import api from "./api";

export const getRangeReport = async (
  fromDate,
  toDate
) => {
  const response = await api.get(
    `/reports/range?fromDate=${fromDate}&toDate=${toDate}`
  );

  return response.data;
};