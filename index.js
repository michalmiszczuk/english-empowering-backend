const express = require("express");
const winston = require("winston");
const app = express();
const error = require("./middleware/error");
const cors = require("cors");
require("express-async-errors");

winston.add(new winston.transports.Console());
app.use(express.json());

app.use(cors());

app.use(error);

require("./startup/logging");
require("./startup/db")();
require("./startup/checks")();
require("./startup/routes")(app);
require("./startup/prod")(app);

const port = process.env.PORT || 9000;
app.listen(port, () => winston.info(`Server started on port ${port}`));
