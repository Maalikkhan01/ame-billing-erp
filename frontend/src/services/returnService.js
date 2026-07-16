import api from "./api";

export const createReturn = async (data) => {
  const response = await api.post("/returns", data);

  return response.data;
};
