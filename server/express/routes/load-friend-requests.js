const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/', (req, res) => {
    fs.readFile('../users.json', 'utf-8', (err, data) => {
        const usersFile = JSON.parse(data);

        const userIndex = req.body.userIndex;

        const requests = usersFile.users[userIndex].incomingRequests;

        res.json({
            requests: requests
        });
    })
});

module.exports = router;