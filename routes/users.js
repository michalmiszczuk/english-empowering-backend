const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const {User, validate} = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const validateID = require("../middleware/validateID");
const admin = require("../middleware/admin");

const transporter = require("../mailServices/mailService");
const {Lesson} = require("../models/lesson");

router.get("/", [auth, admin], async (req, res) => {
  const users = await User.find().populate("reservedLessons");
  if (!users) res.status(404).send("There are no lessons in the database.");
  res.send(users);
});

router.get("/:id", [validateID, auth], async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("reservedLessons");
  if (!user) res.status(404).send("A user with the given Id was not found.");
  res.send(user);
});

router.post("/", async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let userEmail = await User.findOne({email: req.body.email});
  let userPhone = await User.findOne({phone: req.body.phone});
  if (userEmail || userPhone) return res.status(400).send("Taki użytkownik już istnieje.");

  user = new User({
    name: req.body.name,
    surname: req.body.surname,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    reservedLessons: [],
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
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "surname", "email"]));

  const mailOptions = {
    from: "eng.empowering@gmail.com",
    to: user.email,
    subject: "Pomyślne założenie konta",
    text: `Cześć ${user.name} !
      Udało Ci się pomyślnie założyć konto. Przed zarezerowaniem lekcji zapoznaj się proszę
      z regulaminem dostępnym na stronie (link na dole strony). W razie jakichkolwiek pytań
      zapraszam do kontaktu :)`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info.response);
    }
  });
});

router.put("/:id", [validateID, auth], async (req, res) => {
  const prevUser = await User.findById(req.params.id);

  let user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      surname: req.body.surname,
      password: prevUser.password,
      email: req.body.email,
      phone: req.body.phone,
      reservedLessons: req.body.reservedLessons,
      progress: req.body.progress,
    },
    {new: true}
  );

  if (!user) res.status(404).send("User with the given ID was not found");

  user = await user.save();
  res.send("lalalaa");

  if (prevUser.reservedLessons.length >= user.reservedLessons.length) return;

  const lesson = await Lesson.findById(user.reservedLessons[0]);
  const lessonDate = new Date(lesson.date);
  const hour = lessonDate.toLocaleTimeString("default", {timeStyle: "short"});
  const dateToSend = lessonDate.toLocaleDateString();

  const mailOptions = {
    from: "eng.empowering@gmail.com",
    to: user.email,
    subject: "Rezerwacja lekcji",
    text: `Cześć ${user.name} !
    Udało Ci się zarezerwować lekcję na godzinę ${hour} dnia ${dateToSend} !
    Pamiętaj, że lekcję zgodnie z regulaminem można odwołać do 24h przed jej rozpoczęciem`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info.response);
    }
  });
});

router.delete("/:id", [validateID, auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) res.status(404).send("User with the given ID was not found");
  res.send(user);
});

module.exports = router;
