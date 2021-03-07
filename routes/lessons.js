const express = require("express");
const router = express.Router();
const {Lesson, validate, validateUpdate} = require("../models/lesson");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateID = require("../middleware/validateID");
const validator = require("../middleware/validator");

router.get("/", async (req, res) => {
  const lessons = await Lesson.find();
  if (!lessons) res.status(404).send("There are no lessons in the database.");
  res.send(lessons);
});

router.get("/:id", async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) res.status(404).send("A lesson with the given ID was not found");
  res.send(lesson);
});

router.post("/", [validator(validate), auth, admin], async (req, res) => {
  const lessons = await Lesson.find();
  let lessonCompared = new Date(req.body.date);
  let lessonComparedString = lessonCompared.toString();

  for (lesson of lessons) {
    let lessonDate = new Date(lesson.date);
    let lessonDateString = lessonDate.toString();
    if (lessonDateString === lessonComparedString)
      return res.status(400).send("Lekcja o danej godzinie już istnieje.");
  }

  let newLesson = new Lesson({
    date: req.body.date,
    isDisabled: req.body.isDisabled,
    isReserved: req.body.isReserved,
  });
  newLesson = await newLesson.save();
  res.send(newLesson);
});

router.put("/:id", [validateID, auth, validator(validateUpdate)], async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    {
      date: req.body.date,
      isDisabled: req.body.isDisabled,
      isReserved: req.body.isReserved,
    },
    {new: true}
  );

  if (!lesson) res.status(404).send("A lesson with the given ID was not found");

  res.send(lesson);
});

router.delete("/:id", [validateID, auth, admin], async (req, res) => {
  const lesson = await Lesson.findByIdAndRemove(req.params.id);
  if (!lesson) res.status(404).send("A lesson with the given ID was not found");
  res.send(lesson);
});

module.exports = router;
