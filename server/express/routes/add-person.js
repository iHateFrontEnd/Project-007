const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

async function addPerson(username, groupName, res) {
  const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const users = await client.db('user-data').collection('user').findOne({});

    //checking if the user to be added exist's
    var userFound = false;
    
    for(var userIndex = 0; userIndex <= users.users.length - 1; userIndex++) {
      if(users.users[userIndex].username == username) {
        userFound = true;
        break;
      }
    }

    if(userFound == true) {
      //adding user to the group
      const group = await client.db('groups').collection(groupName).findOne({})
      group.permittedUsers.push(username);

      await client.db('groups').collection(groupName).replaceOne({}, group, {});

      users.users[userIndex].groups.push(groupName);

      await client.db('user-data').collection('user').replaceOne({}, users, {});

      res.json({
        status: 'success'
      });
    } else {
      res.json({
        status: 'failed',
        reason: 'user not found'
      });
    }
  } catch(err) {
    console.log(err);
  }

}

router.post('/', (req, res) => {
  const groupName = req.body.groupName;
  const username = req.body.username;

  addPerson(username, groupName, res);
});

module.exports = router;
