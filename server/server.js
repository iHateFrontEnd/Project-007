const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const io = require('socket.io')(5000, {
  cors: {
    origin: ['http://localhost:3000']
  }
});
const configFile = require('./config.json');
const usersFile = require('./users.json');
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);

//websockets
io.on('connection', socket => {
  socket.on('send-msg', (msg, username, typedMsg, groupName) => {
    console.log('connected');
    let group = require(`./groups/${groupName}.json`);

    group.chat.push({ [username]: typedMsg });

    fs.writeFile(`./groups/${groupName}.json`, JSON.stringify(group, null, 2), (err) => {
      if (err) {
        console.log(err);
      }
    });

    io.emit('recive-msg', group.chat);
  });

  //accepting friend request 
  socket.on('accept-request', (data) => {
    //this is the user who sent the request
    const toAcceptUser = data.toAcceptUser;
    var toAcceptUserIndex = -1;

    //this is the user who accepted the request
    const userIndex = data.userIndex;
    const username = usersFile.users[userIndex].username;

    //finding toAcceptUserIndex
    for (let i = 0; i <= usersFile.users.length; i++) {
      toAcceptUserIndex++;

      if (usersFile.users[i].username == toAcceptUser) {
        break;
      }
    }

    usersFile.users[userIndex].incomingRequests.splice(toAcceptUser, 1);
    usersFile.users[userIndex].friends.push(toAcceptUser);

    usersFile.users[toAcceptUserIndex].sentRequest.splice(username, 1);
    usersFile.users[toAcceptUserIndex].friends.push(username);

    fs.writeFile('./users.json', JSON.stringify(usersFile, null, 2), (err) => {
      if (err) {
        console.log(err);
      }
    });

    io.emit('added-friend', username);
  });
});

//importing routes
const loginRoute = require('./routes/login');
const signUpRoute = require('./routes/sign-up');
const loadChatData = require('./routes/load-chat-data');
const friendRequest = require('./routes/add-friend');
const joinGroup = require('./routes/join-group');
const createGroup = require('./routes/create-group');
const changeUsername = require('./routes/change-username');
const changePassword = require('./routes/change-password');
const loadFriendRequests = require('./routes/load-friend-requests');
const declineRequest = require('./routes/decline-request');
const reloadChat = require('./routes/reload-chat');
const addPerson = require('./routes/add-person');
const loadGroups = require('./routes/load-groups');
const leaveGroup = require('./routes/leave-group');

app.get('/', (req, res) => {
  res.send('Hello world');
});

//sending the latest msg to clients connected to server
app.use('/reload-chat', reloadChat);

//loggin in a user
app.use('/login', loginRoute);

//creating a new user
app.use('/sign-up', signUpRoute);

//send chat data
app.use('/load-chat-data', loadChatData);

//friend request
app.use('/friend-request', friendRequest);

//join group
app.use('/join-group', joinGroup);

//creates a group
app.use('/create-group', createGroup);

//changing username
app.use('/change-username', changeUsername);

//changing password 
app.use('/change-password', changePassword);

//loading friend requests
app.use('/load-friend-requests', loadFriendRequests);

//declining a request
app.use('/decline-request', declineRequest);

//adding people to a group
app.use('/add-person', addPerson);

//loading groups
app.use('/load-groups', loadGroups);

//leaving group 
app.use('/leave-group', leaveGroup);

app.listen(4000);
