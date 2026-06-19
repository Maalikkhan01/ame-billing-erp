const express = require("express");

const router =
  express.Router();

const {
  createProduct,
  getProducts,
  searchProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require(
  "../controllers/productController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/",
  protect,
  createProduct
);

router.get(
  "/",
  protect,
  getProducts
);

router.get(
  "/search",
  protect,
  searchProducts
);

router.get(
  "/:id",
  protect,
  getProductById
);

router.put(
  "/:id",
  protect,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  deleteProduct
);

module.exports = router;