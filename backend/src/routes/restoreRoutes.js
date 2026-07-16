const express = require("express");

const router = express.Router();

const {
  previewRestore,
  restoreBackup,
} = require("../controllers/restoreController");

router.post("/preview", previewRestore);
router.post("/restore", restoreBackup);

module.exports = router;
