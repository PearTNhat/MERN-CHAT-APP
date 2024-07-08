var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("./models/userModel.js");
const { v4: uuidv4 } = require("uuid");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.URL_SERVER}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      const tokenLogin = uuidv4();
      try {
        if (profile.emails[0].verified === false)
          return cb("Email unauthorized", null);
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          // Nếu không tồn tại, tạo tài khoản mới
          user = new User({
            googleId: profile.id,
            name: profile.name.familyName + profile.name.givenName,
            email: profile.emails[0].value,
            pic: profile.photos[0].value,
          });
        }
        // Tồn tại mà chưa có googleId thì thêm googleId
        if (!user.googleId) {
          user.googleId = profile.id;
        }
        // tao 1 tokenLogin moi khi login bang google
        user.tokenLogin = tokenLogin;
        await user.save();
        console.log(user.tokenLogin);
        profile.tokenLogin = tokenLogin;
        return cb(null, profile);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);
