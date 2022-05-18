const express = require('express');
const router = express.Router();
const fs = require('fs');
var usersFile = require('../users.json');

//this function changes the users.json
function modifyUsersFile(username, groupName) {
    //searching for user
    var userIndex = -1;

    for (let i = 0; i <= usersFile.users.length; i++) {
        userIndex++;

        if (usersFile.users[i].username == username) break;
    }

    //searching for group inside "groups" obj of the user
    var groupIndex = -1;

    for (let i = 0; i <= usersFile.users[userIndex].groups.length; i++) {
        groupIndex++;

        if (usersFile.users[userIndex].groups[i] == groupName) break;
    }

    usersFile.users[userIndex].groups.splice(groupIndex, 1);

    fs.writeFile(`./users.json`, JSON.stringify(usersFile), (err) => {
        if (err) console.log(err);
    });
}

//this function changes the main chat/group file
function modifyGroupFile(groupName, username) {
    var groupFile = require(`../groups/${groupName}.json`);

    //searching for group inside "groups" obj of the user
    var userIndex = -1;

    for (let i = 0; i <= groupFile.permittedUsers.length; i++) {
        userIndex++;

        if (groupFile.permittedUsers[i] == username) break;
    }

    groupFile.permittedUsers.splice(userIndex, 1);

    fs.writeFile(`./groups/${groupName}.json`, JSON.stringify(groupFile), (err) => {
        if (err) console.log(err);
    });
}

router.post('/', (req, res) => {
    const groupName = req.body.groupName;
    const toRemoveUser = req.body.toRemoveUser;

    modifyUsersFile(toRemoveUser, groupName);

    modifyGroupFile(groupName, toRemoveUser);

    res.end();
});

module.exports = router;