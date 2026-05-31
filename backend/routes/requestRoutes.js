const express = require("express");
const router = express.Router();

const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
} = require("../controllers/requestController");

const {
  authenticateJWT,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Protect all request routes
router.use(authenticateJWT);

// =========================
// Request Routes
// =========================

// Create request
router.post(
  "/",
  authorizeRoles("User", "Admin"),
  createRequest
);

// Get all requests
router.get("/", getRequests);

// Get single request
router.get("/:id", getRequestById);

// Update request status
router.put("/:id/status", updateRequestStatus);

module.exports = router;