const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require("../utils/generateToken");

// Register Owner

const registerOwner = async (req, res) => {
  try {
    const { name, mobile, password, ownerKey } = req.body;

    if (!name || !mobile || !password || !ownerKey) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (ownerKey !== process.env.OWNER_SETUP_KEY) {
      return res.status(401).json({
        success: false,
        message: "Invalid Owner Setup Key",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingOwner = await User.findOne({
      role: "OWNER",
    });

    if (existingOwner) {
      return res.status(400).json({
        success: false,
        message: "Owner already exists",
      });
    }

    const existingUser = await User.findOne({
      mobile,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Mobile already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await User.create({
      name,
      mobile,
      password: hashedPassword,
      role: "OWNER",
    });

    res.status(201).json({
      success: true,
      token: generateToken(owner._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login

const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile and Password are required",
      });
    }

    const user = await User.findOne({
      mobile,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerOwner,
  loginUser,
};
