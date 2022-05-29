const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: 'http://192.168.1.168:3000'
  })
);

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
const addPerson = require('./routes/add-person');
const loadGroups = require('./routes/load-groups');
const leaveGroup = require('./routes/leave-group');
const changeGroupName = require('./routes/change-group-name');
const removeUser = require('./routes/remove-user');
const unFriendUser = require('./routes/un-friend-user');

app.get('/', (req, res) => {
  res.send('Hello world');
});

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

//changing group name
app.use('/change-group-name', changeGroupName);

//kicking / removing user out of the group
app.use('/remove-user', removeUser);

//unfriending a user
app.use('/un-friend-user', unFriendUser);

app.listen(process.env.PORT || 4000, () => console.log('express server'));
