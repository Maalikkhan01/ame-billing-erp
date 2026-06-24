const ActivityLog = require("../models/ActivityLog");
const LoginHistory = require("../models/LoginHistory");

// Activity Logs

const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({}, null, {
      lean: true,
    })
      .populate("userId", "name mobile role")
      .sort({ createdAt: -1 })
      .limit(200);

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login History
const getLoginHistory = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = 50;

    const skip = (page - 1) * limit;

    const logs = await LoginHistory.find()
      .lean()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const total = await LoginHistory.countDocuments();

    res.json({
      success: true,
      logs,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Login History Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getActivityLogs,
  getLoginHistory,
};
