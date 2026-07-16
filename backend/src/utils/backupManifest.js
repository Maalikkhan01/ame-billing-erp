const packageJson = require("../../package.json");

function createBackupManifest(summary) {
  return {
    app: "AME Billing ERP",

    version: packageJson.version,

    backupDate: new Date().toISOString(),

    nodeVersion: process.version,

    collections: Object.keys(summary),

    recordCount: summary,
  };
}

module.exports = {
  createBackupManifest,
};
