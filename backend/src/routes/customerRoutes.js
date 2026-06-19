const express = require("express");

const router = express.Router();

const {
  createCustomer,
  getCustomers,
  searchCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const { customerValidation } = require("../validators/customerValidator");

const validate = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, customerValidation, validate, createCustomer);

router.get("/", protect, getCustomers);

router.get("/search", protect, searchCustomers);

router.get("/:id", protect, getCustomerById);

router.put("/:id", protect, customerValidation, validate, updateCustomer);

router.delete("/:id", protect, deleteCustomer);

module.exports = router;
