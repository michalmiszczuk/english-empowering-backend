const Joi = require("joi");
const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  date: Date,
  isDisabled: {type: Boolean, default: false},
  isReserved: {type: Boolean, default: false},
});

function validateLesson(lesson) {
  const schema = {
    date: Joi.date(),
    isDisabled: Joi.boolean(),
    isReserved: Joi.boolean(),
  };
  return Joi.validate(lesson, schema);
}

const Lesson = mongoose.model("lesson", lessonSchema);

module.exports.Lesson = Lesson;
module.exports.validate = validateLesson;
