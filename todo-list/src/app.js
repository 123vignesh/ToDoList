const express = require("express");
const path = require("path");

var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var obj = require("./backend/databases/sqlite");
var app = express();


app.set("view-engine", "ejs");
app.set("views", __dirname + "/client/views");
app.set(express.static(path.resolve(__dirname, "client")));

app.engine("html", require("ejs").renderFile);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

var route = require("./backend/routes/mainRoutes");



app.use(cookieParser());

app.use(
  session({
    secret: "shruthi",
    resave: false,
    saveUninitialized: false,
    cookie: {},
  })
);

app.use("/", route);

app.use(express.static(path.join(__dirname, "client/images/")));
app.use(express.static(path.join(__dirname, "client/css/")));

app.get("/geton", (req, res) => {
  obj.users
    .findAll({
      where: {
        email:"led@zeppelin.com",
      },
      limit: 10,
    })
    .then(function (users) {
      console.log(users);
      res.send({
        error: false,
        message: "users list",
        data: users,
      });
    })
    .catch(function (err) {
      console.log("Oops! something went wrong, : ", err);
    });
});

app.get("/getout", (req, res) => {
  obj.users
    .destroy({
      where: {
        name:"Led Zeppelin",
        email: "led@zeppelin.com",
        password:"stairwaytoheaven"
      },
      truncate: true,
    })
    .then((result) => {
      console.log("success");
    });
});

app.listen(4000, () => {
  console.log("server is listening at port 4000");
});

module.exports = app;
