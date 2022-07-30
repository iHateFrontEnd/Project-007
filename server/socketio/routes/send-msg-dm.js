const { MongoClient } = require('mongodb');

async function sendDmMsg(msg, userIndex, username, fUsername, io) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority';

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const users = await client.db('user-data').collection('user').findOne({});

        var collectionName = '';

        for(let i = 0; i <= users.users[userIndex].friends.length; i++) {
            var friend = users.users[userIndex].friends[i];

            if (friend.username == fUsername) {
                collectionName = friend.collectionName;
                break;
            }
        }
        
        const chat = await client.db('personal').collection(collectionName).findOne({});
    
        chat.chat.push({
            [username]: msg
        });

        io.emit('recive-msg-dm', chat.chat);

        await client.db('personal').collection(collectionName).replaceOne({}, chat, {});

    } catch (err) {
        console.log(err);
    }

}

module.exports = sendDmMsg;
