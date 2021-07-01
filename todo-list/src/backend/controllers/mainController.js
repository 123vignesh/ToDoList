var path = require("path");
const express = require("express");
var obj = require("../databases/sqlite");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

let Signin = (req, res) => {
  var pathToFile = path.join(__dirname, "../../client/views/signin.ejs");
  res.render(pathToFile);
};

let Signup = (req, res) => {
  var pathToFile = path.join(__dirname, "../../client/views/signup.ejs");
  res.render(pathToFile);
};

let SignupPost = (req, res) => {
  const {
    name,
    email,
    password
  } = req.body;
  if (!(name, email && password)) {
    res.send("Provide the correct input");
  } else {
    const big = req.sessionID;
    obj.users
      .create({
        name,
        email,
        password,
        big,
      })
      .then((result) => {
        req.session.name = req.body.name;
        req.session.email = req.body.email;

        console.log(req.session);
        res.redirect("/");
      })
      .catch((result) => {
        console.log(result);
        console.log("Email already exist");
        res.redirect("/signup")
      });
  }
};

let l = [];
let lk = [];
let SigninPost = (req, res) => {
  obj.users
    .findAll({
      where: {
        email: req.body.email,
        password:req.body.password,
      },
      limit: 5,
    })
    .then(function (users) {
      if(users.length===0){
        res.redirect("/signin");
      }
      console.log(users);
      if (users.length > 0) {
        req.session.email = users[0].dataValues.email;
        req.session.name = users[0].dataValues.name;

        obj.lists
          .findAll({
            where: {
              userId: req.body.email,
            },
          })
          .then(function (lists) {
            console.log(lists);

            if (lists.length !== undefined) {
              if (l.length === 0) {
                for (var j = 0; j < lists.length; j++) {

                  l.push(lists[j].dataValues.item);
                  lk.push(lists[j].dataValues.done);


                }
              }
              req.session.item = l;
              req.session.done = lk;
              return res.redirect("/");
            } else {
              res.redirect("/");
              console.log(req.session);
            }
          })
          .catch((result) => {
            console.log(result);
          });
      }
    })
    .catch((err) => {
      console.log("Email or password entered is incorrect");
      
    });
};

let Home = (req, res) => {
  var pathToFile = path.join(__dirname, "../../client/views/profile.ejs");
  console.log(req.session);
  console.log(req.body);
  res.render(pathToFile, {
    tago: req.session,
  });
};

let a = [];
let Add = (req, res) => {
  a = [];
  let ak = [];
  const {
    item
  } = req.body;
  if (!item) {
    console.log("Provide the correct input");
  } else {
    const userID = req.session.email;
    obj.lists
      .create({
        item,
        userID,
      })
      .then((result) => {
        obj.lists
          .findAll({
            where: {
              userID: req.session.email,
            },
          })
          .then((result) => {
            for (var k = 0; k < result.length; k++) {
              a.push(result[k].dataValues.item);
              ak.push(result[k].dataValues.done);
            }

            req.session.item = a;
            req.session.done = ak;
            res.redirect("/");
          })
          .catch((result) => {
            a.push(item);
            req.session.item = a;
            res.redirect("/");
          });
      })
      .catch((result) => {
        console.log(result);
      });
  }
};

let Crud = (req, res) => {
  var on = [];
  var tr;
  if (req.body.done !== undefined) {
    obj.lists
      .update({
        done: "green",
      }, {
        where: {
          userID: req.session.email,
          item: req.body.item,
        },
      })
      .then((result) => {
        console.log("updated Successfully the color");
        console.log(req.session.done);
        tr = req.session.item.indexOf(req.body.item);
        req.session.done[tr] = "green";
      })
      .catch((result) => {
        console.log(result);
      });

    setTimeout(() => {
      res.redirect("/");
    }, 500);
  } else {
    var q;
    if (req.body.delete !== undefined && req.body.done === undefined) {
      obj.lists
        .destroy({
          where: {
            userID: req.session.email,
            item: req.body.item,
          },
        })
        .then((result) => {
          console.log("successfully deleted");
          q = req.session.item.indexOf(req.body.item);
          req.session.item.splice(q, 1);
          console.log(req.session.item);
        })
        .catch((result) => {
          console.log(result);
        });
      setTimeout(() => {
        res.redirect("/");
      }, 400);
    } else {
      if (req.body.editVal !== undefined && req.body.done === undefined) {
        req.session.item[t] = req.body.editVal;
        obj.lists
          .update({
            item: req.body.editVal,
          }, {
            where: {
              userID: req.session.email,
              item: req.body.item,
            },
          })
          .then((count) => {
            console.log("Rows updated " + count);
          })
          .catch((result) => {
            console.log(result);
          });

        req.session.index = undefined;
      } else if (req.body.delete === undefined && req.body.done === undefined) {
        t = req.session.item.indexOf(req.body.item);
        req.session.index = t;
      }
      res.redirect("/");
    }
  }
};

let Signout = (req, res) => {
  console.log(req.session);

  req.session.destroy();

  console.log(req.session);
  res.redirect("/signin");
};

const redirectprofile = (req, res, next) => {
  if (req.session.name) {
    res.redirect("/");
  } else {
    next();
  }
};

const redirectSignup = (req, res, next) => {
  if (req.session.name) {
    next();

  } else {
    res.redirect("/signin");
  }
};


let Pages = {
  Signin: Signin,
  Signup: Signup,
  Signout: Signout,
  SignupPost: SignupPost,
  SigninPost: SigninPost,
  Home: Home,
  Add: Add,
  Crud: Crud,
  redirectprofile: redirectprofile,
  redirectSignup: redirectSignup
};
module.exports = Pages;