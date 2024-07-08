const router = require("express").Router();
const passport = require("passport");
const { loginWithGoogle } = require("../controller/authController");
// session:false để không lưu session mà sài jwwt
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, profile) => {
      if (err) {
        return next(err);
      }
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(
      `${process.env.URL_CLIENT}/other-login/${req.user.id}/${req.user.tokenLogin}`
    );
  }
);
router.post("/login-success", loginWithGoogle);
module.exports = router;
