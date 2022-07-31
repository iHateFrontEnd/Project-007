const { MongoClient } = require('mongodb');

async function sendGroupsMsg(username, typedMsg, groupName, io) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        const groupCollection = await client.db('groups').collection(groupName).findOne({});

        groupCollection.chat.push({ [username]: typedMsg });

        io.emit('recive-msg-groups', groupCollection.chat);

        await client.db('groups').collection(groupName).replaceOne({}, groupCollection, {});
    } catch(err) {
        console.log(err);
    }
}

module.exports = sendGroupsMsg;
