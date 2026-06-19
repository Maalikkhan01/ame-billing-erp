const express = require("express");

const router = express.Router();

const { authLimiter } = require("../middleware/rateLimitMiddleware");

const { registerOwner, loginUser } = require("../controllers/authController");

router.post("/register-owner", authLimiter, registerOwner);

router.post("/login", authLimiter, loginUser);

module.exports = router;
