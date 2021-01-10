const mongoose = require("mongoose");
require("dotenv").config();

module.exports = function () {
  mongoose.connect(process.env.ENG_EMPOWERING_DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", error => console.error(error)), db.once("open", () => console.log("Connected to Database"));
};
