const jwt = require("jsonwebtoken");
const generateToken = (_id) => {
  const token = jwt.sign({ _id: _id }, process.env.SECRET_JWT, {
    expiresIn: "30d",
  });
  return token;
};
module.exports = generateToken;
