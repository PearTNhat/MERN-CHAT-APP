const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  deleteNotification,
  fetchNotification,
  createOrUpdateNotification,
} = require("../controller/notificationController");
const router = express.Router();
router
  .route("/")
  .get(protect, fetchNotification)
  .post(protect, createOrUpdateNotification);
router.route("/:id").delete(protect, deleteNotification);
module.exports = router;
