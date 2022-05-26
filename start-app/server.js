const express = require('express');
const app = express();
const cors = require('cors');

app.get('/', (req, res ) => {
  res.send('Hello world');
});

app.listen(6000);
