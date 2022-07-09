const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');

async function saveNonStaticFiles(res) {
  const nonStaticFile = [
    "users.json",
    "groups.json"
  ]

  //write to DB here 

  const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const usersFile = {
      users: []
    }

    client.db('user-data').collection('user').insertOne(usersFile);
  } catch (err) {
    console.log(err);
  }
}

app.get('/non-static-file', (req, res) => {
  saveNonStaticFiles(res);
})

app.get('/', (req, res) => {
  res.json('Hello world');
});

app.listen(6000);
