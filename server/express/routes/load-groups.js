const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/', (req, res) => {
  fs.readFile('../users.json', 'utf-8', (err, data) => {

    const usersFile = JSON.parse(data);


    const userIndex = req.body.userIndex;

    var friendArr = [];

    for (let i = 0; i <= usersFile.users[userIndex].friends.length - 1; i++) {
      friendArr.push(usersFile.users[userIndex].friends[i].username);
    }

    console.log(friendArr);

    res.json(
      {
        friends: friendArr,
        groups: usersFile.users[userIndex].groups
      }
    );

  })
});

module.exports = router;
