const express = require('express');
const router = express.Router();
const fs = require('fs');
var usersFile = require('../../users.json');

router.post('/', (req, res) => {
  const userIndex = req.body.userIndex;
  const username = req.body.username;
  const groupName = req.body.groupName;

  //modifying users.json
  var groupObjIndex = -1;

  for (let i = 0; i <= usersFile.users[userIndex].groups.length; i++) {
    groupObjIndex++;

    if (usersFile.users[userIndex].groups[i] == groupName) break;
  }

  usersFile.users[userIndex].groups.splice(groupObjIndex, 1);

  fs.writeFile('../users.json', JSON.stringify(usersFile), (err) => {
    if (err) console.log(err);
  });

  //modifying the group/chat file
  var groupFile = require(`../../groups/${groupName}.json`);

  var permittedUsersObjIndex = -1;

  for (let i = 0; i <= groupFile.permittedUsers.length; i++) {
    permittedUsersObjIndex++;

    if (groupFile.permittedUsers[i] === username) break;
  }

  groupFile.permittedUsers.splice(permittedUsersObjIndex, 1);

  fs.writeFile(`../groups/${groupName}.json`, JSON.stringify(groupFile), (err) => {
    if (err) console.log(err);
  });

  res.end();
});

module.exports = router;
