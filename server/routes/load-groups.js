const express = require('express');
const router = express.Router();
const usersFile = require('../users.json');

router.post('/', (req, res) => {
  const userIndex = req.body.userIndex;

  res.send(usersFile.users[userIndex]);

  res.end();
});

module.exports = router;
