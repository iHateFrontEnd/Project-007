const io = require('socket.io')(5000, {
    cors: {
        origin: 'http://192.168.1.168:3000'
    },
});

//importing routes
const sendGroupsMsg = require('./routes/send-msg-groups');
const sendDmMsg = require('./routes/send-msg-dm');
const acceptRequest = require('./routes/accept-request');

io.on('connection', socket => {
    //updating msg's for gorup chat
    socket.on('send-msg-groups', (msg, username, typedMsg, groupName) => {
        sendGroupsMsg(username, typedMsg, groupName, io);
    });

    //updating msg's for dm chat
    socket.on('send-msg-dm', (msg, userIndex, username, fUsername) => {
        sendDmMsg(msg, userIndex, username, fUsername, io);
    });

    //accepting friend request 
    socket.on('accept-request', (toAcceptUser, userIndex, username) => {
        acceptRequest(toAcceptUser, userIndex, username, socket);
    });
});
