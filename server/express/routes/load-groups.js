const express = require('express');
const router = express.Router();
const usersFile = require('../../users.json');

router.post('/', (req, res) => {
  const userIndex = req.body.userIndex;

  const toSend = usersFile.users[userIndex];

  res.json(toSend);

  res.end();
});

module.exports = router;
