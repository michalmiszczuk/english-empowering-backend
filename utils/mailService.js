const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "eng.empowering@gmail.com",
    pass: "dw75mM0Wm9jzc7!",
  },
});

module.exports = transporter;
