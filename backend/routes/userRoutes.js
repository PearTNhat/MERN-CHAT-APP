const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgetPassword,
} = require("../controller/authController");
const { searchUser } = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");
router.route("/").post(registerUser).get(protect, searchUser);

router.post("/login", loginUser);
router.put("/forget-password", forgetPassword);

module.exports = router;
