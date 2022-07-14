const express = require('express');
const fs = require('fs');
const router = express.Router();
const { MongoClient } = require('mongodb');
var usersFile = require('../../users.json');

async function createUser(username, password) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        //reading users
        const oldUsersData = await client.db('user-data').collection('user').findOne({});

        const userData = {
            username: username,
            password: password,
            friends: [],
            groups: [],
            incomingRequests: [],
            sentRequest: []
        }

        const newUsersData = oldUsersData;

        newUsersData.users.push(userData);

        await client.db('user-data').collection('user').replaceOne({}, newUsersData, {});
    } catch (err) {
        console.log(err);
    }
}

router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    createUser(username, password);

    res.end();
});

module.exports = router;
