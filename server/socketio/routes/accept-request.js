const configFile = require('../../config.json');
const { MongoClient } = require('mongodb');

async function acceptRequest(toAcceptUser, userIndex, username, socket) {
    //this is the user who sent the request
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const users = await client.db('user-data').collection('user').findOne({});

        var toAcceptUserIndex = -1;

        //finding toAcceptUserIndex
        for (let i = 0; i <= users.users.length - 1; i++) {
            toAcceptUserIndex++;

            if (users.users[i].username == toAcceptUser) {
                break;
            }
        }


        //for the user who accepted the request
        for (let i = 0; i <= users.users[userIndex].incomingRequests.length; i++) {
            if (users.users[userIndex].incomingRequests[i] == toAcceptUser) {
                users.users[userIndex].incomingRequests.splice(i, 1);
                break;
            }
        }

        //for the user who sent the request
        for (let i = 0; i <= users.users[toAcceptUserIndex].sentRequest.length; i++) {
            if (users.users[toAcceptUserIndex].sentRequest[i] == username) {
                users.users[toAcceptUserIndex].sentRequest.splice(i, 1);
                break;
            }
        }

        users.users[toAcceptUserIndex].friends.push(
            {
                username: username,
                chatFile: `${username}&${toAcceptUser}.json`
            }
        );


        users.users[userIndex].friends.push(
            {
                username: toAcceptUser,
                chatFile: `${username}&${toAcceptUser}.json`
            }
        );

        //updating DB
        await client.db('user-data').collection('user').replaceOne({}, users, {});

        //creating the chat file 
        configFile.dmChatLayout.permittedUsers.push(toAcceptUser, username);

        fs.writeFile(`../personal/${username}&${toAcceptUser}.json`, JSON.stringify(configFile.dmChatLayout), (err) => {
            if (err) console.log(err);
        });

        socket.broadcast.emit('added-friend', username, toAcceptUser);
    } catch(err) {
        console.log(err);
    }
}

module.exports = acceptRequest;