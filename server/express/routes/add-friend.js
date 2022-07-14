const express = require('express');
const router = express.Router();
const usersFile = require('../../users.json');
const { MongoClient } = require('mongodb');
const configFile = require('../../config.json');
const fs = require('fs');

//f refers to friend
async function addFriend(res, userIndex, username, fUsername, fUserIndex) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const users = await client.db('user-data').collection('user').findOne({});

        //writing to incoming requests
        users.users[userIndex].sentRequest.push(fUsername);

        //wrirting to sentRequests
        users.users[fUserIndex].incomingRequests.push(username);

        await client.db('user-data').collection('user').replaceOne({}, users, {});

        res.json({
            status: 'success'
        });
    } catch(err) {
        console.log(err);
    }
}

router.post('/', (req, res) => {
    const userIndex = parseInt(req.body.userIndex);
    const username = req.body.username;
    const fUsername = req.body.fUsername;

    var userFound = false;

    for (var fUserIndex = 0; fUserIndex <= usersFile.users.length - 1; fUserIndex++) {
        if (usersFile.users[fUserIndex].username == fUsername) {
            userFound = true;
            break;
        }
    }

    if(userFound == true) {
        addFriend(res, userIndex, username, fUsername, fUserIndex); 
    } else {
        res.json({
            status: 'failed'
        });
    }
});

module.exports = router;