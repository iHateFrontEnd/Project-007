const configFile = require('../config.json');
const io = require('socket.io')(5000, {
    cors: {
        origin: 'http://localhost:3000'
    },
});
const fs = require('fs');
var usersFile = require('../users.json');
const { formatWithOptions } = require('util');

io.on('connection', socket => {
    //updating msg's for gorup chat
    socket.on('send-msg-groups', (msg, username, typedMsg, groupName) => {

        let group = require(`../groups/${groupName}.json`);

        group.chat.push({ [username]: typedMsg });

        fs.writeFile(`../groups/${groupName}.json`, JSON.stringify(group, null, 2), (err) => {
            if (err) {
                console.log(err);
            }
        });

        io.emit('recive-msg-groups', group.chat);
    });

    //updating msg's for dm chat
    socket.on('send-msg-dm', (msg, username, fUsername) => {
        var dmFile;
        var tryOrCatch;

        try {
            dmFile = require(`../personal/${username}&${fUsername}.json`);
            tryOrCatch = 'try';
        } catch (err) {
            dmFile = require(`../personal/${fUsername}&${username}.json`);
            tryOrCatch = 'catch';
        }

        dmFile.chat.push({
            [username]: msg
        });

        if (tryOrCatch == 'try') {
            fs.writeFile(`../personal/${username}&${fUsername}.json`, JSON.stringify(dmFile), (err) => {
                if (err) console.log(err);
            });
        } else {
            fs.writeFile(`../personal/${fUsername}&${username}.json`, JSON.stringify(dmFile), (err) => {
                if (err) console.log(err);
            });
        }

        io.emit('recive-msg-dm', dmFile.chat);
    });

    //accepting friend request 
    socket.on('accept-request', (toAcceptUser, userIndex, username) => {
        fs.readFile('../users.json', 'utf-8', (err, data) => {
            const usersFile = JSON.parse(data);

            //this is the user who sent the request
            var toAcceptUserIndex = -1;

            //finding toAcceptUserIndex
            for (let i = 0; i <= usersFile.users.length - 1; i++) {
                toAcceptUserIndex++;

                if (usersFile.users[i].username == toAcceptUser) {
                    break;
                }
            }


            //for the user who accepted the request
            for (let i = 0; i <= usersFile.users[userIndex].incomingRequests.length; i++) {
                if (usersFile.users[userIndex].incomingRequests[i] == toAcceptUser) {
                    usersFile.users[userIndex].incomingRequests.splice(i, 1);
                    break;
                }
            }

            //for the user who sent the request
            for (let i = 0; i <= usersFile.users[toAcceptUserIndex].sentRequest.length; i++) {
                if (usersFile.users[toAcceptUserIndex].sentRequest[i] == username) {
                    usersFile.users[toAcceptUserIndex].sentRequest.splice(i, 1);
                    break;
                }
            }

            usersFile.users[toAcceptUserIndex].friends.push(
                {
                    username: username,
                    chatFile: `${username}&${toAcceptUser}.json`
                }
            );


            usersFile.users[userIndex].friends.push(
                {
                    username: toAcceptUser,
                    chatFile: `${username}&${toAcceptUser}.json`
                }
            );

            fs.writeFile('../users.json', JSON.stringify(usersFile, null, 2), (err) => {
                if (err) {
                    console.log(err);
                }
            });

            //creating the chat file 
            configFile.dmChatLayout.permittedUsers.push(toAcceptUser, username);

            fs.writeFile(`../personal/${username}&${toAcceptUser}.json`, JSON.stringify(configFile.dmChatLayout), (err) => {
                if (err) console.log(err);
            });

            socket.broadcast.emit('added-friend', username, toAcceptUser);
        });
    });
});
