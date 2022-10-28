const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

async function loadChat(res, fUsername, userIndex) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const users = await client.db('user-data').collection('user').findOne({});

        var collectionName = '';

        //finding chat file name
        for (let i = 0; i <= users.users[userIndex].friends.length; i++) {
            if (users.users[userIndex].friends[i].username == fUsername) {
                collectionName = users.users[userIndex].friends[i].collectionName;

                break;
            }
        }

        const chat = await client.db('personal').collection(collectionName).findOne({});

        res.send(chat);

    } catch (err) {
        console.log(err);
    }
}

async function loadGroupChat(groupName, res) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const group = await client.db('groups').collection(groupName).findOne({});

        res.json({
            permittedUsers: group.permittedUsers,
            requestedUsers: group.requestedUsers,
            chat: group.chat,
            groupName: groupName
        });
    } catch (err) {
        console.log(err);
    }
}

async function chatData(username, res) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const user = await client.db('users').collection(username).findOne({});

        res.json({
            groups: user.groups,
            friends: user.friends
        });
    } catch (err) {
        console.log(err);
    }
}

router.post('/', (req, res) => {
    if (req.body.toLoad == 'group') {
        const groupName = req.body.groupName;
        loadGroupChat(groupName, res);
    } else if (req.body.toLoad == 'dm') {
        const userIndex = req.body.userIndex;
        const fUsername = req.body.fUsername;

        loadChat(res, fUsername, userIndex);
    } else if (req.body.toLoad == 'chat-data') {
        const username = req.body.username;

        chatData(username, res);
    }
});

module.exports = router;