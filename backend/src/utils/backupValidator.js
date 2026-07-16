function validateBackup(backup) {
  if (!backup) {
    throw new Error("Backup file is empty.");
  }

  if (!backup.manifest) {
    throw new Error("Backup manifest not found.");
  }

  if (!backup.collections) {
    throw new Error("Collections section missing.");
  }

  const requiredCollections = ["customers", "products", "bills", "ledger"];

  for (const name of requiredCollections) {
    if (!Array.isArray(backup.collections[name])) {
      throw new Error(`${name} collection is invalid.`);
    }
  }

  return true;
}

module.exports = {
  validateBackup,
};
