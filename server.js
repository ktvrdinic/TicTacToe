const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var tictacController = require("./controller/tictacController");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Bodyparser Middleware
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/static", express.static("./static/"));

tictacController(app);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
