const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/', (req, res) => {
    fs.readFile('../users.json', 'utf-8', (err, data) => {
        if (err) console.log(err);
        else {
            const userIndex = req.body.userIndex;

            const usersFile = JSON.parse(data);

            res.json({
                requests: usersFile.users[userIndex].incomingRequests
            });
        }
    })
});

module.exports = router;