const express = require("express");
const router = express.Router();

const { getUserDetails } = require("../controllers/authController");
const { authenticateJWT } = require("../middleware/authMiddleware");

router.get("/", authenticateJWT, getUserDetails);

module.exports = router;
