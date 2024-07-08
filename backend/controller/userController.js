const User = require("../models/userModel");

const searchUser = async (req, res) => {
  let keyword = req.query.search;
  keyword = keyword
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
};
module.exports = { searchUser };
