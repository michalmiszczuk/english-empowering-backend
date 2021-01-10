module.exports = function () {
  if (!process.env.ENG_EMPOWERING_JWT_KEY) {
    throw new Error("FATAL ERROR: jwt not defined.");
  }
  if (!process.env.MAIL_PASSWORD) {
    throw new Error("FATAL ERROR: Mail password not defined.");
  }
  if (!process.env.ENG_EMPOWERING_DATABASE) {
    throw new Error("FATAL ERROR: Database address not defined.");
  }
};
