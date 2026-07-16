const { validateBackup } = require("../utils/backupValidator");
const { restoreCollections } = require("./databaseRestoreService");
const { checkBackupCompatibility } = require("../utils/backupCompatibility");

const restoreBackup = async (backup) => {
  validateBackup(backup);
  checkBackupCompatibility(backup.manifest);

  return restoreCollections(backup);
};

const previewBackup = async (backup) => {
  validateBackup(backup);
  return {
    manifest: backup.manifest,

    summary: backup.manifest.recordCount,
  };
};

module.exports = {
  previewBackup,
  restoreBackup,
};
