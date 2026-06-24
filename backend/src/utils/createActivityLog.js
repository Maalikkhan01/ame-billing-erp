const ActivityLog = require(
  "../models/ActivityLog"
);

const createActivityLog = async ({
  userId,
  action,
  entityType,
  entityId,
  details,
}) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (error) {
    console.error(
      "Activity Log Error:",
      error.message
    );
  }
};

module.exports = createActivityLog;