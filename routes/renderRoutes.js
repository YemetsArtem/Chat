const express = require("express");
const router = express.Router();

/* GET Home page. */
router.get("/", (req, res, next) => {
  if (req.session.userId && req.cookies.userLogin) {
    res.redirect("/chat");
  } else {
    res.redirect("/login");
  }
});

/* GET chat page. */
router.get("/chat", (req, res) => {
  if (req.session.userId && req.cookies.userLogin) {
    res.render("main_min");
    return;
  }
  res.status(403).send("Access denied");
});

/* Logout. */
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("userLogin");
  res.clearCookie("io");
  res.redirect("/");
});

module.exports = router;
