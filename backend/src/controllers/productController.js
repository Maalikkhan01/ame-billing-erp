const Product = require("../models/Product");

// Create Product

const createProduct = async (req, res) => {
  try {
    const { measurementType, category, brand, name, description, units } =
      req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!measurementType) {
      return res.status(400).json({
        success: false,
        message: "Measurement Type is required",
      });
    }

    if (!category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!Array.isArray(units) || units.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one unit is required",
      });
    }

    const usedUnits = new Set();

    for (const unit of units) {
      if (!unit.type) {
        return res.status(400).json({
          success: false,
          message: "Unit type required",
        });
      }

      if (usedUnits.has(unit.type)) {
        return res.status(400).json({
          success: false,
          message: `Duplicate unit ${unit.type}`,
        });
      }

      usedUnits.add(unit.type);

      if (unit.parentUnit && unit.parentUnit === unit.type) {
        return res.status(400).json({
          success: false,
          message: `${unit.type} cannot be its own parent unit`,
        });
      }

      if (unit.parentUnit && (!unit.quantity || unit.quantity <= 0)) {
        return res.status(400).json({
          success: false,
          message: `Invalid conversion quantity for ${unit.type}`,
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
    }

    const existing = await Product.findOne({
      measurementType,
      category: category.trim(),
      brand: (brand || "").trim(),
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
      measurementType,

      category: category.trim(),

      brand: (brand || "").trim(),

      name: name.trim(),

      description: description?.trim() || "",

      units: units.map((unit) => ({
        ...unit,

        quantity: Number(unit.parentUnit ? unit.quantity : 1),

        parentUnit: unit.parentUnit || null,

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

    const { keyword, category, brand, measurementType, active } = req.query;

    const filters = {};

    if (active !== undefined) {
      filters.active = active === "true";
    } else {
      filters.active = true;
    }

    if (keyword?.trim()) {
      filters.name = {
        $regex: keyword.trim(),
        $options: "i",
      };
    }

    if (category?.trim()) {
      filters.category = category.trim();
    }

    if (brand?.trim()) {
      filters.brand = brand.trim();
    }

    if (measurementType?.trim()) {
      filters.measurementType = measurementType.trim();
    }

    const products = await Product.find(filters)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filters);

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
      }
    }

    if (req.body.measurementType) {
      product.measurementType = req.body.measurementType;
    }

    if (req.body.category !== undefined) {
      product.category = req.body.category.trim();
    }

    if (req.body.brand !== undefined) {
      product.brand = req.body.brand.trim();
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
