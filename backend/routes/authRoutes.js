const express = require("express");

const router = express.Router();

const {
    login,
    getCurrentUser,
} = require("../controllers/authController");

const {
    authenticateJWT,
} = require("../middleware/authMiddleware");


// ---------------- AUTH ROUTES ----------------

// Login
router.post("/login", login);

// Get logged in user
router.get(
    "/user",
    authenticateJWT,
    getCurrentUser
);

module.exports = router;