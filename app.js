const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/index');

const app = express();

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.log('error')
      throw error
    }
    console.log(results.rows)
    res.status(200).json(results.rows)
  })
});

app.listen(PORT, () => {
  console.log('Server started successfully.');
})