const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Bill = require("../models/Bill");
const Ledger = require("../models/Ledger");

const { createBackupManifest } = require("../utils/backupManifest");

const createBackup = async () => {
  const [customers, products, bills, ledger] = await Promise.all([
    Customer.find().lean(),
    Product.find().lean(),
    Bill.find().lean(),
    Ledger.find().lean(),
  ]);

  const summary = {
    customers: customers.length,
    products: products.length,
    bills: bills.length,
    ledger: ledger.length,
  };

  return {
    manifest: createBackupManifest(summary),

    collections: {
      customers,
      products,
      bills,
      ledger,
    },
  };
};

module.exports = {
  createBackup,
};
