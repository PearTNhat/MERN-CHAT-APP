const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/generateToken");
const { v4: uuidv4 } = require("uuid");
const registerUser = async (req, res) => {
  const { name, password, email, pic } = req.body;
  if (name === "" || password === "" || email === "") {
    return res.status(400).json("Please full in all field");
  }
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(406).json("User already exists");
    } else {
      try {
        const newUser = await User.create({ name, email, password, pic });
        if (newUser) {
          return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            pic: newUser.pic,
            token: generateToken(newUser._id),
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json("Please full in all field");
    }
    const user = await User.findOne({ email });
    if (user.googleId && !user.password) {
      return res.status(400).json("Invalid email or password");
    }
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(403).json("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};
const loginWithGoogle = async (req, res, next) => {
  try {
    const { googleId, tokenLogin } = req.body;
    if (!googleId || !tokenLogin) {
      return res.status(400).json("Missing googleId or tokenLogin");
    }
    const user = await User.findOne({ googleId, tokenLogin });
    if (!user)
      return res.status(400).json("User not found fail login with google");
    const newTokenLogin = uuidv4();
    // update tokenLogin prevent disclosure
    user.tokenLogin = newTokenLogin;
    await user.save();
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};
const forgetPassword = async (req, res) => {
  let { email, newPassword } = req.body;
  const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  if (regex.test(email)) {
    try {
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);
      const newUpdate = await User.findOneAndUpdate(
        { email: email },
        { password: newPassword },
        {
          new: true,
        }
      );
      if (newUpdate) {
        return res.status(200).json("Change password successfully");
      } else {
        return res.status(400).json("Email not found");
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json("Change password failed");
    }
  } else {
    return res.status(400).json("Email is not valid");
  }
};
module.exports = { registerUser, loginUser, forgetPassword, loginWithGoogle };
