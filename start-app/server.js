const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

async function saveNonStaticFiles(res) {
  const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const usersFile = {
      users: []
    }

    await client.db('user-data').collection('user').replaceOne({}, usersFile, {});

    const result = await client.db('user-data').collection('user').findOne({});

    res.send(result);
  } catch (err) {
    console.log(err);
  }
}

app.get('/reset-users', (req, res) => {
  saveNonStaticFiles(res);
});

app.get('/', (req, res) => {
  res.json('Hello world');
});

app.listen(6000);
