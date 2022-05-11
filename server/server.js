const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const io = require('socket.io')(5000, {
  cors: {
    origin: ['http://192.168.0.168:3000']
  }
});
const configFile = require('./config.json');
const usersFile = require('./users.json');
app.use(express.json());
app.use(
  cors({
    origin: 'http://192.168.0.168:3000'
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
const acceptRequest = require('./routes/accept-request');
const declineRequest = require('./routes/decline-request');
const saveGroupChat = require('./routes/save-group-chat');
const reloadChat = require('./routes/reload-chat');
const addPerson = require('./routes/add-person');
const loadGroups = require('./routes/load-groups');

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

//changing password app.use('/change-password', changePassword);
//loading friend requests
app.use('/load-friend-requests', loadFriendRequests);

//accepting a friend request
app.use('/accept-request', acceptRequest);

//declining a request
app.use('/decline-request', declineRequest);

//saving group chat to a .json file
app.use('/save-group-chat', saveGroupChat);

//adding people to a group
app.use('/add-person', addPerson);

//loading groups
app.use('/load-groups', loadGroups);

app.listen(4000);
