const mongoose = require("mongoose");

const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Bill = require("../models/Bill");
const Ledger = require("../models/Ledger");

async function restoreCollections(backup) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Customer.deleteMany({}, { session });
    await Product.deleteMany({}, { session });
    await Bill.deleteMany({}, { session });
    await Ledger.deleteMany({}, { session });

    if (backup.collections.customers.length) {
      await Customer.insertMany(backup.collections.customers, { session });
    }

    if (backup.collections.products.length) {
      await Product.insertMany(backup.collections.products, { session });
    }

    if (backup.collections.bills.length) {
      await Bill.insertMany(backup.collections.bills, { session });
    }

    if (backup.collections.ledger.length) {
      await Ledger.insertMany(backup.collections.ledger, { session });
    }

    await session.commitTransaction();

    return {
      success: true,
    };
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
}

module.exports = {
  restoreCollections,
};
