const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

async function loadDmData(userIndex, res) {
  const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority';

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const usersDB = await client.db('user-data').collection('user').findOne({});

    console.log(usersDB);

    var friendsArr = [];

    for (let i = 0; i <= usersDB.users[userIndex].friends.length - 1; i++) {
      friendsArr.push(usersDB.users[userIndex].friends[i].username);
    }

    res.json(
      {
        friends: friendsArr,
        groups: usersDB.users[userIndex].groups
      }
    );
  } catch(err) {
    console.log(err); 

    res.end();
  }
}

async function loadGroupData(groupName, res) {
  const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority';

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const chatCollection = await client.db('groups').collection(groupName).findOne({});

    res.json({
      permittedUsers: chatCollection.permittedUsers,
      requestedUsers: chatCollection.requestedUsers,
      chat: chatCollection.chat,
      groupName: groupName
    });
  } catch(err) {
    console.log(err);
  }
}

router.post('/', (req, res) => {
  const userIndex = req.body.userIndex;
  const groupName = req.body.groupName;

  if(req.body.toLoad == 'group') loadGroupData(groupName, res);
  else if (req.body.toLoad == 'dm') loadDmData(userIndex, res);
});

module.exports = router;
