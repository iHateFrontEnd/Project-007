const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

async function unFriendUser(username, userIndex, fUsername, res) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const users = await client.db('user-data').collection('user').findOne({});

        var collectionName;
        
        //searching for friend's index in friends arr
        for(let i = 0; i <= users.users[userIndex].friends.length; i++) {
            let friends = users.users[userIndex].friends[i];

            if (friends.username == fUsername) {
                collectionName = friends.collectionName;
                users.users[userIndex].friends.splice(i, 1);
                break;
            }
        }

        //finding fUserIndex
        for (var fUserIndex = 0; fUserIndex <= users.users.length; fUserIndex++) {
            if (users.users[fUserIndex].username == fUsername) break;
        }

        for(let i = 0; i <= users.users[fUserIndex].friends.length; i++) {
            let friend = users.users[fUserIndex].friends[i];

            if(friend.username == username) {
                users.users[fUserIndex].friends.splice(i, 1);
                break;
            }
        }

        await client.db('user-data').collection('user').replaceOne({}, users, {});

        await client.db('personal').collection(collectionName).drop();

    } catch(err) {
        console.log(err);
    }
}


router.post('/', (req, res) => {
    const userIndex = req.body.userIndex;
    const username = req.body.username;
    const fUsername = req.body.fUsername;

    unFriendUser(username, userIndex, fUsername, res);
});

module.exports = router;
