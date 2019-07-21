const express = require("express");
const fs = require("fs");
const users = require("../users.json");
const resaveUser = require("../middleware/userResave.js");
const findUser = require("../middleware/userFinder.js");
const router = express.Router();

let AllFoundUsers = [];

/* GET login page. */
router
  .route("/login")
  .get((req, res) => {
    if (req.session.userId && req.cookies.userLogin) {
      res.redirect("/chat");
    }
    console.log(req.session);

    // //   Rewrite json file
    // fs.writeFileSync(
    //   "E:/Beetroot/Node JS/_Messenger/users.json",
    //   JSON.stringify(users, null, 2)
    // );

    res.render("login");
  })
  .post((req, res) => {
    let foundUser = findUser(
      req.body.email,
      req.body.password,
      req.body.checkbox,
      req.session,
      res
    );

    AllFoundUsers.push(foundUser);

    console.log(req.session);
    res.send(foundUser);
  });

/* GET  User data. */
router
  .route("/db")
  .get((req, res) => {
    AllFoundUsers.forEach(user => {
      if (req.cookies.userLogin === user.login) res.send(user);
    });
  })
  .post((req, res) => {
    if (req.body.nickname !== undefined) {
      AllFoundUsers.forEach(user => {
        if (req.body.nickname === user.login) res.send(user);
      });
    } else {
      AllFoundUsers.find(user => {
        if (req.cookies.userLogin === user.login) {
          user = resaveUser(req, user);
          res.end();
        }
      });
    }
  });

router.get("/dbAll", (req, res) => {
  res.send(users);
});
module.exports = router;
