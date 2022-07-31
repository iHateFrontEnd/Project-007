const express = require('express');
const router = express.Router();
const configFile = require('../../config.json');
const { MongoClient } = require('mongodb');

async function createGroup(username, groupName, userIndex, res) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const users = await client.db('user-data').collection('user').findOne({});
        users.users[userIndex].groups.push(groupName);

        await client.db('user-data').collection('user').replaceOne({}, users, {});

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
    const groupName = req.body.groupName.replaceAll(' ', '-');
    const userIndex = req.body.userIndex;

    createGroup(username, groupName, userIndex, res);

    res.end();
});

module.exports = router;
