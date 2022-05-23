const express = require('express');
const router = express.Router();
const fs = require('fs');
var usersFile = require('../../users.json');

router.post('/', (req, res) => {
    const userIndex = req.body.userIndex;
    const username = req.body.username;
    const fUsername = req.body.fUsername;

    //finding fUser's index
    var fUserIndex = -1;

    for (let i = 0; i <= usersFile.users.length; i++) {
        fUserIndex++;

        if (usersFile.users[i].username == fUsername) break;
    }

    //unfriending for user (username)
    var friendsIndex = -1;

    for (let i = 0; i <= usersFile.users[userIndex].friends.length; i++) {
        friendsIndex++;

        if (usersFile.users[userIndex].friends[i] == fUsername) break;
    }

    usersFile.users[userIndex].friends.splice(fUserIndex, 1);

    //unfriending for fUser (fUsername)
    friendsIndex = -1;

    for (let i = 0; i <= usersFile.users[fUserIndex].friends.length; i++) {
        friendsIndex++;

        if (usersFile.users[fUserIndex].friends[i] == username) break;
    }

    usersFile.users[fUserIndex].friends.splice(friendsIndex, 1);

    fs.writeFile('../users.json', JSON.stringify(usersFile), (err) => {
        if (err) console.log(err);
    });

    //deleting the chat file
    try {
        fs.unlink(`../groups/${username}&${fUsername}.json`, (err) => {
            if (err) console.log(err);
        });
    } catch (err) {
        fs.unlink(`../groups/${fUsername}&${username}.json`, (err) => {
            if (err) console.log(err);
        });
    }
});

module.exports = router;