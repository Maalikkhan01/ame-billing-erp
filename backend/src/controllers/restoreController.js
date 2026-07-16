const RestoreService = require("../services/restoreService");

const previewRestore = async (req, res) => {
  try {
    const preview = await RestoreService.previewBackup(req.body);

    res.json({
      success: true,
      preview,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const restoreBackup = async (req, res) => {
  try {
    const { confirmation, backup } = req.body;

    if (confirmation !== "RESTORE DATABASE") {
      return res.status(400).json({
        success: false,
        message: "Restore confirmation failed.",
      });
    }

    await RestoreService.restoreBackup(backup);

    res.json({
      success: true,
      message: "Database restored successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  previewRestore,
  restoreBackup,
};
