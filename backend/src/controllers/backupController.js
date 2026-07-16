const BackupService = require("../services/backupService");

const createBackup = async (req, res) => {
  try {
    const backup = await BackupService.createBackup();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=backup-${Date.now()}.json`,
    );

    res.setHeader("Content-Type", "application/json");

    res.send(JSON.stringify(backup, null, 2));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBackupStatus = async (req, res) => {
  try {
    const backup = await BackupService.createBackup();

    res.json({
      success: true,

      manifest: backup.manifest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBackup,
  getBackupStatus,
};
