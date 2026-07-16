const express = require("express");

const router = express.Router();

const {
  createBackup,
  getBackupStatus,
} = require("../controllers/backupController");

router.get("/export", createBackup);
router.get("/status", getBackupStatus);

module.exports = router;
