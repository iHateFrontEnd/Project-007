const express = require('express');
const router = express.Router();
const configFile = require('../../config.json');
const { MongoClient } = require('mongodb');

async function createGroup(username, groupName, res) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        var userCollection = await client.db('users').collection(username).findOne({});
        userCollection.groups.push(groupName);

        await client.db('users').collection(username).replaceOne({}, userCollection, {});

        await client.db('groups').createCollection(groupName);

        //configuring chat file
        configFile.groupChatLayout.groupName = groupName;
        configFile.groupChatLayout.permittedUsers.push(username);

        await client.db('groups').collection(groupName).insertOne(configFile.groupChatLayout);
    } catch(err) {
        console.log(err);
    }
}

router.post('/', (req, res) => {
    const username = req.body.username;
    const groupName = req.body.groupName;
    console.log(groupName);

    createGroup(username, groupName, res);

    res.end();
});

module.exports = router;
