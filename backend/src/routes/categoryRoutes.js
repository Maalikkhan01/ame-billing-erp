const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createCategory,
  getCategories,
  searchCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Create Category
router.post("/", protect, createCategory);

// Get All Categories
router.get("/", protect, getCategories);

// Search Categories
router.get("/search", protect, searchCategories);

// Get Category By Id
router.get("/:id", protect, getCategoryById);

// Update Category
router.put("/:id", protect, updateCategory);

// Delete Category (Soft Delete)
router.delete("/:id", protect, deleteCategory);

module.exports = router;
