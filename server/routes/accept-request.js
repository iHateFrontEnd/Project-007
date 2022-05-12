const express = require('express');
const router = express.Router();
const fs = require('fs');
var usersFile = require('../users.json');

router.post('/', (req, res) => {
    const userIndex = req.body.userIndex;
    const toAcceptUser = req.body.toAcceptUser
    const toAcceptUserIndex = req.body.toAcceptUserIndex;

    console.log('restarting');
    res.end();
});

module.exports = router;
