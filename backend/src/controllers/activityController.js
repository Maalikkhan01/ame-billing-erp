const ActivityLog = require("../models/ActivityLog");
const LoginHistory = require("../models/LoginHistory");

const getActivityLogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = 50;

    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find()
      .lean()
      .populate("userId", "name mobile")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const total = await ActivityLog.countDocuments();

    res.json({
      success: true,
      logs,
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
