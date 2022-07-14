const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/', (req, res) => {
    const groupName = req.body.groupName;
    const username = req.body.username;

    var groupFile = require(`../../groups/${groupName}`);
    var usersFile = require('../../users.json');

    //modifying groups file
    for(let i = 0; i <= groupFile.requestedUsers.length; i++) {
        if (groupFile.requestedUsers[i] == username) {
            groupFile.requestedUsers.splice(i, 1);
            break;
        }
    }

    groupFile.permittedUsers.push(username);

    //modifying users.json
    for(var userIndex = 0; userIndex <= usersFile.users.length - 1; userIndex++) {
        if (usersFile.users[userIndex].username == username) {
            usersFile.users[userIndex].groups.push(groupName);
            console.log(usersFile.users[userIndex]);
        }
    }

    //this is to be changed
    fs.writeFile()

    res.send('hello world');
});

module.exports = router;
