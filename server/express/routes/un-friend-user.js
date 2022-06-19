const express = require('express');
const router = express.Router();
const fs = require('fs');

function unFriendUser(userIndex, index, usersFile) {
    usersFile.users[userIndex].friends.splice(index, 1);

    fs.writeFile('../users.json', JSON.stringify(usersFile, null, 2), (err) => {
        if (err) console.log(err);
    });
}

function filterUsernames(userIndex, usersFile) {
    var friendsArr = []

    //filtering friend's username
    for (let i = 0; i <= usersFile.users[userIndex].friends.length - 1; i++) {
        friendsArr.push(usersFile.users[userIndex].friends[i].username);
    }

    return friendsArr;
}

router.post('/', (req, res) => {
    const userIndex = req.body.userIndex;
    const username = req.body.username;
    const fUsername = req.body.fUsername;

    var fUserIndex;

    fs.readFile('../users.json', 'utf-8', (err, data) => {
        const usersFile = JSON.parse(data);

        var friendsArr = filterUsernames(userIndex, usersFile);

        //getting the userIndex for the user who is about to be un-friended
        for (let i = 0; i <= usersFile.users.length - 1; i++) {
            if (usersFile.users[i].username == fUsername) {
                fUserIndex = i;
                break;
            }
        }

        //for the user who un-friended
        for (let i = 0; i <= friendsArr.length; i++) {
            if (friendsArr[i] == fUsername) {
                unFriendUser(userIndex, i, usersFile);
            }
        }

        friendsArr = filterUsernames(fUserIndex, usersFile);

        //for the user who is about to be unfriended
        for (let i = 0; i <= friendsArr.length; i++) {
            if (friendsArr[i] == username) {
                unFriendUser(fUserIndex, i, usersFile);
            }
        }
    });

    res.end();
});


module.exports = router;