import api from "./api";

export const getBills = async (
  page = 1,
  keyword = ""
) => {
  const response = await api.get(
    `/bills?page=${page}&keyword=${encodeURIComponent(keyword)}`
  );

  return response.data;
};