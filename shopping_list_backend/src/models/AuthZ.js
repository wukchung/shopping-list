
// THIS FILE WILL NOT BE USED IN PROJECT. IT IS JUST TO HAVE THE

function isOwner(currentUser, listCreator) {
  return currentUser === listCreator;
}

function isAdmin() {
  return true;
}

function isShared(currentUser, allowedUsers) {
  return allowedUsers.includes(currentUser);
}

module.exports = {
  isOwner,
  isAdmin,
  isShared,
};
