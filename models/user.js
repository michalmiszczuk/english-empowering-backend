const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  surname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  password: {
    type: String,
    required: true,
    minlength: 0,
    maxlength: 1024,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    minlength: 9,
    maxlength: 9,
  },
  isAdmin: Boolean,
  reservedLessons: [{type: mongoose.Types.ObjectId, ref: "lesson"}],
  progress: [{title: {type: String}, currentLevel: {type: Number, default: 0}}],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, "Lemury7234!");
  return token;
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().required().min(3).max(23),
    surname: Joi.string().required().min(3).max(23),
    password: Joi.string().required().min(5).max(1024),
    email: Joi.string().required().min(5).max(40).email(),
    phone: Joi.string().required().min(9).max(9),
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;
