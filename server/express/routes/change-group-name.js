const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

async function changeGroupName(newGroupName, oldGroupName, userIndex, res) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        var group = JSON.stringify(await client.db('groups').collection(oldGroupName).findOne({})).replaceAll(oldGroupName, newGroupName);
        var users = JSON.stringify(await client.db('user-data').collection('user').findOne({})).replaceAll(oldGroupName, newGroupName);

        const parsedUsers = JSON.parse(users);
        const parsedGroup = JSON.parse(group);

        const chatData = {
            groups: parsedUsers.users[userIndex].groups,
            friends: parsedUsers.users[userIndex].friends
        }

        //removing the chat file/collection and creating a new collection with the new name
        await client.db('groups').dropCollection(oldGroupName);

        const currentGroupData = {
            permittedUsers: parsedGroup.permittedUsers,
            requestedUsers: parsedGroup.requestedUsers
        }

        await client.db('groups').createCollection(newGroupName);

        res.json({
            chatData: chatData,
            currentGroupData: currentGroupData
        });

        await client.db('groups').collection(newGroupName).insertOne(JSON.parse(group));
    } catch (err) {
        console.log(err);
    }
}

router.post('/', (req, res) => {
    const newGroupName = req.body.newGroupName.replaceAll(' ', '-');
    const userIndex = req.body.userIndex;
    const oldGroupName = req.body.groupName;

    changeGroupName(newGroupName, oldGroupName, userIndex, res);
});

module.exports = router;
