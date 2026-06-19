const Product = require("../models/Product");

// Create Product

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      piecePrice,
      hasPacking,
      packingType,
      packingQty,
      packingPrice,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!piecePrice || piecePrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid piece price",
      });
    }

    if (hasPacking) {
      if (!packingType) {
        return res.status(400).json({
          success: false,
          message: "Packing type required",
        });
      }

      if (!packingQty || packingQty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Packing quantity required",
        });
      }

      if (!packingPrice || packingPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "Packing price required",
        });
      }
    }

    const existing = await Product.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
      active: true,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description,
      piecePrice,
      hasPacking,
      packingType,
      packingQty,
      packingPrice,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Products

const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = 20;

    const skip = (page - 1) * limit;

    const products = await Product.find({
      active: true,
    })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({
      active: true,
    });

    res.json({
      success: true,
      products,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Product

const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const products = await Product.find({
      active: true,
      name: {
        $regex: keyword,
        $options: "i",
      },
    }).limit(50);

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Single Product

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.body.name) {
      const existingProduct = await Product.findOne({
        name: {
          $regex: `^${req.body.name.trim()}$`,
          $options: "i",
        },
        active: true,
        _id: { $ne: req.params.id },
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Product name already exists",
        });
      }
    }
    if (req.body.piecePrice !== undefined && req.body.piecePrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid piece price",
      });
    }

    if (req.body.hasPacking === true) {
      if (!req.body.packingType) {
        return res.status(400).json({
          success: false,
          message: "Packing type required",
        });
      }

      if (!req.body.packingQty || req.body.packingQty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid packing quantity",
        });
      }

      if (!req.body.packingPrice || req.body.packingPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid packing price",
        });
      }
    }

    if (req.body.name) {
      product.name = req.body.name.trim();
    }

    product.description = req.body.description ?? product.description;

    if (req.body.piecePrice !== undefined) {
      product.piecePrice = req.body.piecePrice;
    }

    if (req.body.hasPacking !== undefined) {
      product.hasPacking = req.body.hasPacking;
    }

    product.packingType = req.body.packingType ?? product.packingType;

    product.packingQty = req.body.packingQty ?? product.packingQty;

    product.packingPrice = req.body.packingPrice ?? product.packingPrice;

    await product.save();

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Soft Delete

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.active = false;

    await product.save();

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  searchProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
