const express = require('express');
const fs = require('fs');
const router = express.Router();
var usersFile = require('../../users.json');

router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userData = {
        username: username,
        password: password,
        friends: [],
        groups: [],
        incomingRequests: [],
        sentRequest: []
    }

    usersFile.users.push(userData);

    fs.writeFile('../users.json', JSON.stringify(usersFile, null, 2), (err) => {
        if (err) {
            console.log(err);
        }
    });

    res.end();
});

module.exports = router;