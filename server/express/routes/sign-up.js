const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const configFile = require('../../config.json');

async function createUser(username, password) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        //creating a new user collection
        await client.db('users').createCollection(username);

        //configuring user
        configFile.userLayout.username = username;
        configFile.userLayout.password = password;


        await client.db('users').collection(username).insertOne(configFile.userLayout);
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
