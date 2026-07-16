const Product = require("../models/Product");

// Create Product

const createProduct = async (req, res) => {
  try {
    const { name, description, units } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!Array.isArray(units) || units.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one unit is required",
      });
    }

    for (const unit of req.body.units) {
      if (!unit.type) {
        return res.status(400).json({
          success: false,
          message: "Unit type required",
        });
      }

      if (!unit.price || unit.price <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${unit.type}`,
        });
      }

      if (unit.costPrice < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid cost price for ${unit.type}`,
        });
      }

      if (unit.mrp < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid MRP for ${unit.type}`,
        });
      }

      if (Number(unit.costPrice) > Number(unit.price)) {
        return res.status(400).json({
          success: false,
          message: `${unit.type} cost price cannot be greater than selling price`,
        });
      }

      if (unit.mrp && Number(unit.price) > Number(unit.mrp)) {
        return res.status(400).json({
          success: false,
          message: `${unit.type} selling price cannot exceed MRP`,
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

      units: units.map((unit) => ({
        ...unit,

        openingStock: Number(unit.openingStock || 0),

        currentStock: Number(unit.openingStock || 0),

        lowStockAlert: Number(unit.lowStockAlert || 5),
      })),

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
      totalProducts: total,
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
    })
      .sort({
        name: 1,
      })
      .limit(50);

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
    if (req.body.units) {
      if (!Array.isArray(req.body.units) || req.body.units.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one unit is required",
        });
      }

      for (const unit of req.body.units) {
        if (!unit.type) {
          return res.status(400).json({
            success: false,
            message: "Unit type required",
          });
        }

        if (!unit.price || unit.price <= 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid price for ${unit.type}`,
          });
        }
        if (unit.costPrice < 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid cost price for ${unit.type}`,
          });
        }

        if (unit.mrp < 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid MRP for ${unit.type}`,
          });
        }

        if (Number(unit.costPrice) > Number(unit.price)) {
          return res.status(400).json({
            success: false,
            message: `${unit.type} cost price cannot be greater than selling price`,
          });
        }

        if (unit.mrp && Number(unit.price) > Number(unit.mrp)) {
          return res.status(400).json({
            success: false,
            message: `${unit.type} selling price cannot exceed MRP`,
          });
        }
      }
    }

    if (req.body.name) {
      product.name = req.body.name.trim();
    }

    product.description = req.body.description ?? product.description;

    if (req.body.units) {
      product.units = req.body.units;
    }

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
