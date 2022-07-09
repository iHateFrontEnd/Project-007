const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const fs = require('fs');

async function loadChatData(userIndex, res) {
  const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority';

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const usersDB = await client.db('user-data').collection('user').findOne({});

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

router.post('/', (req, res) => {
  const userIndex = req.body.userIndex;

  loadChatData(userIndex, res);
});

module.exports = router;
