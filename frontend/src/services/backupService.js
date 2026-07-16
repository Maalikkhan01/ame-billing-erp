import api from "./api";

/**
 * Download backup
 */
export const downloadBackup = async () => {
  const response = await api.get("/backup/export", {
    responseType: "blob",
  });

  return response.data;
};

/**
 * Preview restore
 */
export const previewRestore = async (backup) => {
  const response = await api.post("/restore/preview", backup);

  return response.data.preview;
};

/**
 * Restore database
 */
export const restoreDatabase = async (payload) => {
  const response = await api.post("/restore/restore", payload);

  return response.data;
};
