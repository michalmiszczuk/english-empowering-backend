const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

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
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get("jwtPrivateKey"));
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

async function createUser() {
  const newUser = new User({
    name: "John",
    surname: "Smith",
    password: "fdf4f4ffsfsad",
    email: "4245@domain.com",
    progress: [
      {title: "Tenses", currentLevel: 0},
      {title: "Articles", currentLevel: 0},
      {title: "Questions", currentLevel: 0},
      {title: "Adj ING vs ED", currentLevel: 0},
      {title: "Adj GET vs BE", currentLevel: 0},
      {title: "Passive voice", currentLevel: 0},
      {title: "Infinitive", currentLevel: 0},
      {title: "Modal verbs", currentLevel: 0},
      {title: "Modal verbs (PAST)", currentLevel: 0},
      {title: "Prefer / Rather", currentLevel: 0},
      {title: "Used to", currentLevel: 0},
      {title: "Reported Speech", currentLevel: 0},
      {title: "Contrast Clauses", currentLevel: 0},
      {title: "Time Clauses", currentLevel: 0},
      {title: "Purpose Clauses", currentLevel: 0},
      {title: "Reason Clauses", currentLevel: 0},
      {title: "Defining / Non-def", currentLevel: 0},
      {title: "Impersonal Passive", currentLevel: 0},
      {title: "Participles", currentLevel: 0},
      {title: "Inversion", currentLevel: 0},
    ],
    reservedLessons: [],
  });

  const result = await newUser.save();
  console.log(result);
}

module.exports.User = User;
module.exports.validate = validateUser;
