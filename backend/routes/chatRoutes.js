const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFormGroup,
} = require("../controller/chatController");
const router = express.Router();
router.route("/").post(protect, accessChat).get(protect, fetchChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/add-group").put(protect, addToGroup);
router.route("/group-remove").put(protect, removeFormGroup);
module.exports = router;