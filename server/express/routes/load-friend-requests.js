const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

async function loadFriendReqs(res, userIndex) { 
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const users = await client.db('user-data').collection('user').findOne({});

        res.send({
            requests: users.users[userIndex].incomingRequests
        });
    } catch(err) {
        console.log(err);
    }
}

router.post('/', (req, res) => {
    loadFriendReqs(res, req.body.userIndex);
});

module.exports = router;