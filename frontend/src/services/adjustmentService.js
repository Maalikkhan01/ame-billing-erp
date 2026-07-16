import api from "./api";

/**
 * Create Customer Adjustment
 */
export const createAdjustment = async (payload) => {
  const response = await api.post("/adjustments", payload);

  return response.data;
};
