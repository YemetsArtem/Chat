const users = require("../users.json");

function findUser(inputEmail, inputPassword, checkbox, session, res) {
  let foundUser = false;

  users.find(user => {
    const userLogin = user["login"];
    const userEmail = user["email"];
    const userPassword = user["password"];

    if (userEmail === inputEmail && userPassword === inputPassword) {
      foundUser = user;
      session.userId = foundUser._id;
      res.setHeader("Set-Cookie", `userLogin=${userLogin};`);

      if (checkbox) session.cookie.originalMaxAge = 5000;
    }
  });
  return foundUser;
}

module.exports = findUser;
