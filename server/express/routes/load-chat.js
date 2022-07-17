const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const usersFile = require('../../users.json');

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

router.post('/', (req, res) => {
    const groupName = req.body.groupName;

    if (req.body.toLoad == 'group') {
        let groupFile = require(`../../groups/${groupName}.json`);

        res.json({
            permittedUsers: groupFile.permittedUsers,
            requestedUsers: groupFile.requestedUsers,
            chat: groupFile.chat,
            groupName: groupName
        });

    } else if (req.body.toLoad == 'dm') {
        const userIndex = req.body.userIndex;
        const fUsername = req.body.fUsername;

        loadChat(res, fUsername, userIndex);
    }
});

module.exports = router;
