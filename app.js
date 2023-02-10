const express = require('express');

const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('<h1>Hello from your Express.js server!!</h1>');
});

app.listen(PORT, () => {
  console.log('Server started successfully.');
})