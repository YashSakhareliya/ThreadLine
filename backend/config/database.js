const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_URL } = process.env;

if (!MONGODB_URL) {
  console.error("MONGODB_URL is not defined in .env file.");
  process.exit(1);
}

exports.connect = () => {
  mongoose
    .connect(MONGODB_URL)
    .then(() => {
      console.log("DB Connection Success");
    })
    .catch((err) => {
      console.error("DB Connection Failed");
      console.error(err);
      process.exit(1);
    });
};
