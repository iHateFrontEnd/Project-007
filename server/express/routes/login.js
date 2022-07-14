const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const usersFile = require('../../users.json');

async function loginUser(username, password, res) {
    const uri = 'mongodb+srv://rushabh:suketujan22@test-base.7sxb1.mongodb.net/?retryWrites=true&w=majority'

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const usersDB = await client.db('user-data').collection('user').findOne({});

        var userFound = false;

        var passwordStr;
        var usernameStr;

        for(var userIndex = 0; userIndex <= usersDB.users.length - 1; userIndex++) {
            passwordStr = usersDB.users[userIndex].password;
            usernameStr = usersDB.users[userIndex].username;
            
            if(usernameStr == username && passwordStr == password) {
                userFound = true;
                break;
            }
        } 

        if (userFound == true) {
            res.json({
                status: 'success',
                userIndex: userIndex,
                friends: usersDB.users[userIndex].friends,
                groups: usersDB.users[userIndex].groups
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
    const username = req.body.username;
    const password = req.body.password;

    loginUser(username, password, res);
});

module.exports = router;
