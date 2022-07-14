const express = require('express');
const router = express.Router();
const fs = require('fs');
var usersFile = require('../../users.json');

router.post('/', (req, res) => {
  const userIndex = req.body.userIndex;
  const username = req.body.username;
  const groupName = req.body.groupName;

  //modifying users.json
  for(let i = 0; i <= usersFile.users[userIndex].groups.length; i++) {
    //removing the group from the groups arr 
    if(usersFile.users[userIndex].groups[i] == groupName) {
      usersFile.users[userIndex].groups.splice(i, 1); 
      break;
    }
  } 

  fs.writeFile('../users.json', JSON.stringify(usersFile, null, 2), (err) => {
    if(err) console.log(err);;
  });

  //modifying the chat/group file
  var groupFile = require(`../../groups/${groupName}.json`);

  //searching for users's username in permittedUsers arr 
  for(let i = 0; i <= groupFile.permittedUsers.length; i++) {
    if(groupFile.permittedUsers[i] == username) {
      groupFile.permittedUsers.splice(i, 1);
      break;
    }
  }

  fs.writeFile(`../groups/${groupName}.json`, JSON.stringify(groupFile, null, 2), (err) => {
    if(err) console.log(err);
  });

  var friendArr = [];

  for (let i = 0; i <= usersFile.users[userIndex].friends.length - 1; i++) {
    friendArr.push(usersFile.users[userIndex].friends[i].username);
  }

  res.json(
    {
      friends: friendArr,
      groups: usersFile.users[userIndex].groups
    }
  );
});

module.exports = router;
