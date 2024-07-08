const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const protect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json("Not authorized, no token found");
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_JWT);
      req.user = (await User.find({ _id: decoded._id }).select("-password"))[0];
      next();
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json("Token is invalid");
  }
};
module.exports = { protect };
