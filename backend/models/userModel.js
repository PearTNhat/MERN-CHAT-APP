const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
  googleId: { type: String, required: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  pic: {
    type: String,
    default:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-icon-default-avatar-profile-icon-social-media-user-vector-image-209162840.jpg",
  },
  tokenLogin: { type: String, required: false },
});
userSchema.pre("save", async function (next) {
  console.log("enter save");
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function (enterPassword) {
  const verify = await bcrypt.compare(enterPassword, this.password);
  return verify;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
