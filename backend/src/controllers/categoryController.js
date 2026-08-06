const Category = require("../models/Category");
const Product = require("../models/Product");

// =========================================
// CREATE CATEGORY
// =========================================
const createCategory = async (req, res) => {
  try {
    const { name, description, sortOrder, active } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const categoryName = name.trim();

    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${categoryName}$`,
        $options: "i",
      },
      active: true,
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    const category = await Category.create({
      name: categoryName,
      description: description?.trim() || "",
      sortOrder: Number(sortOrder) || 0,
      active: active !== undefined ? active : true,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create category.",
    });
  }
};

// =========================================
// GET ALL CATEGORIES
// =========================================
const getCategories = async (req, res) => {
  try {
    const { keyword = "", active } = req.query;

    const filter = {};

    if (active !== undefined) {
      filter.active = active === "true";
    } else {
      filter.active = true;
    }

    if (keyword.trim()) {
      filter.name = {
        $regex: keyword.trim(),
        $options: "i",
      };
    }

    const categories = await Category.find(filter)
      .sort({
        sortOrder: 1,
        name: 1,
      })
      .lean();

    return res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
    });
  }
};
// =========================================
// SEARCH CATEGORIES
// =========================================
const searchCategories = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim() || "";

    const categories = await Category.find({
      active: true,
      name: {
        $regex: keyword,
        $options: "i",
      },
    })
      .sort({
        sortOrder: 1,
        name: 1,
      })
      .limit(50)
      .lean();

    return res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Search Categories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search categories.",
    });
  }
};

// =========================================
// GET CATEGORY BY ID
// =========================================
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category.",
    });
  }
};

// =========================================
// UPDATE CATEGORY
// =========================================
const updateCategory = async (req, res) => {
  try {
    const { name, description, sortOrder, active } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const oldCategoryName = category.name;

    if (name?.trim()) {
      const newCategoryName = name.trim();

      const existingCategory = await Category.findOne({
        _id: {
          $ne: req.params.id,
        },
        active: true,
        name: {
          $regex: `^${newCategoryName}$`,
          $options: "i",
        },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category already exists.",
        });
      }

      category.name = newCategoryName;
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (sortOrder !== undefined) {
      category.sortOrder = Number(sortOrder);
    }

    if (active !== undefined) {
      category.active = active;
    }

    await category.save();

    // =====================================
    // UPDATE PRODUCTS USING OLD CATEGORY
    // =====================================

    if (oldCategoryName !== category.name) {
      await Product.updateMany(
        {
          category: oldCategoryName,
        },
        {
          $set: {
            category: category.name,
          },
        },
      );
    }

    return res.json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update category.",
    });
  }
};
// =========================================
// DELETE CATEGORY (SOFT DELETE)
// =========================================
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // =====================================
    // CHECK PRODUCTS USING THIS CATEGORY
    // =====================================

    const totalProducts = await Product.countDocuments({
      category: category.name,
      active: true,
    });

    if (totalProducts > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category because products are using it.",
        productsUsingCategory: totalProducts,
      });
    }

    // =====================================
    // SOFT DELETE
    // =====================================

    category.active = false;

    await category.save();

    return res.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete category.",
    });
  }
};

// =========================================
// EXPORTS
// =========================================

module.exports = {
  createCategory,
  getCategories,
  searchCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
