import { useState } from "react";

import {
  downloadBackup,
  previewRestore,
  restoreDatabase,
} from "../services/backupService";

function useBackup() {
  const [loading, setLoading] = useState(false);

  const exportBackup = async () => {
    try {
      setLoading(true);

      return await downloadBackup();
    } finally {
      setLoading(false);
    }
  };

  const preview = async (backup) => {
    try {
      setLoading(true);

      return await previewRestore(backup);
    } finally {
      setLoading(false);
    }
  };

  const restore = async (payload) => {
    try {
      setLoading(true);

      return await restoreDatabase(payload);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    exportBackup,
    preview,
    restore,
  };
}

export default useBackup;
