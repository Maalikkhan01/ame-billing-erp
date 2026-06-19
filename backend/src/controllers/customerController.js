const Customer = require("../models/Customer");

// Add Customer

const createCustomer = async (req, res) => {
  try {
    const { name, mobile, address } = req.body;

    const existingMobile = await Customer.findOne({
      mobile: mobile.trim(),
    });

    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile already exists",
      });
    }

    const existingName = await Customer.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
      isActive: true,
    });

    if (existingName) {
      return res.status(400).json({
        success: false,
        message: "Customer already exists",
      });
    }

    const customer = await Customer.create({
      name: name.trim(),
      mobile: mobile.trim(),
      address: address?.trim() || "",
    });

    res.status(201).json({
      success: true,
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Customers

const getCustomers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = 20;

    const skip = (page - 1) * limit;

    const customers = await Customer.find({
      isActive: true,
    })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const total = await Customer.countDocuments({
      isActive: true,
    });

    res.json({
      success: true,
      customers,
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

// Search Customer

const searchCustomers = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const customers = await Customer.find({
      isActive: true,

      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          mobile: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    });

    res.json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Single Customer

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Customer

const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (req.body.mobile) {
      const existingCustomer = await Customer.findOne({
        mobile: req.body.mobile.trim(),
        _id: { $ne: req.params.id },
      });

      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already exists",
        });
      }
    }
    if (req.body.name) {
      const existingCustomer = await Customer.findOne({
        name: {
          $regex: `^${req.body.name.trim()}$`,
          $options: "i",
        },
        isActive: true,
        _id: { $ne: req.params.id },
      });

      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: "Customer name already exists",
        });
      }
    }

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (req.body.name) {
      customer.name = req.body.name.trim();
    }

    if (req.body.mobile) {
      customer.mobile = req.body.mobile.trim();
    }

    customer.address = req.body.address?.trim() ?? customer.address;

    await customer.save();

    res.json({
      success: true,
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Soft Delete

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (customer.currentDue > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete customer with pending due",
      });
    }

    customer.isActive = false;

    await customer.save();

    res.json({
      success: true,
      message: "Customer deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  searchCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
