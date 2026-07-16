const packageJson = require("../../package.json");

function checkBackupCompatibility(manifest) {
  if (!manifest) {
    throw new Error("Backup manifest missing.");
  }

  if (manifest.app !== "AME Billing ERP") {
    throw new Error("This backup does not belong to AME Billing ERP.");
  }

  if (!manifest.version) {
    throw new Error("Backup version missing.");
  }

  const currentMajor = packageJson.version.split(".")[0];
  const backupMajor = manifest.version.split(".")[0];

  if (currentMajor !== backupMajor) {
    throw new Error(
      `Backup version ${manifest.version} is not compatible with ERP version ${packageJson.version}.`,
    );
  }

  return true;
}

module.exports = {
  checkBackupCompatibility,
};
