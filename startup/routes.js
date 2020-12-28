const express = require("express");
const users = require("../routes/users");
const lessons = require("../routes/lessons");
const auth = require("../routes/auth");

module.exports = function (app) {
  app.use("/api/users", users);
  app.use("/api/lessons", lessons);
  app.use("/api/auth", auth);
};
