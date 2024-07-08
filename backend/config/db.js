const mongoose = require("mongoose");
var colors = require("colors");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connect to ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log("Error: ", `${error.message}`.red.bold);
    process.exit();
  }
};
module.exports = connectDB;
