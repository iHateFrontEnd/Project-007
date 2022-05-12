const express = require('express');
const router = express.Router();
const fs = require('fs');
var usersFile = require('../users.json');

router.post('/', (req, res) => {
  const userIndex = req.body.userIndex;
  const groupName = req.body.groupName;
  const username = req.body.username;
  var group = require(`../groups/${groupName}.json`);

  //modifying users.json
  usersFile.users[userIndex].groups.splice(groupName, 1);

  fs.writeFile('./users.json', JSON.stringify(usersFile), err => {
    if(err) {
      console.log(err);
    }
  });

  //modifying the group file 
  group.permittedUsers.splice(username, 1);

  fs.writeFile(`./groups/${groupName}`, JSON.stringify(group), err => {
    if(err) {
      console.log(err);
    }
  });

  res.end();
});

module.exports = router;
