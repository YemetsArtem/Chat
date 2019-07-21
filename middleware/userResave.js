function resaveUser(req, foundUser) {
  const changedUser = req.body;

  //   Compare changed user from client with found user
  for (let foundUserKey in foundUser) {
    for (let changedUserKey in changedUser) {
      if (foundUserKey === changedUserKey) {
        foundUser[foundUserKey] = changedUser[changedUserKey];
      }
    }
  }

  return foundUser;
}

module.exports = resaveUser;
