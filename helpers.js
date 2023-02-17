const db = require('./db/index');

const findByUsername = (req, res, next) => {
  const { username } = req.body;
  const text = 'SELECT * FROM users WHERE username = $1'
  const values = [username];
  db.query(text, values, (error, results) => {
    if (error) {
      console.log('error')
      throw error
    }
    res.status(200).send(results.rows);
  })
  next();
};

const findById = (id, req, res) => {
  const text = 'SELECT * FROM users WHERE username = $1'
  const values = [id];
  db.query(text, values, (error, results) => {
    if (error) {
      console.log('error')
      throw error
    }
    return results.rows;
  })
};

module.exports = {
    findByUsername,
    findById
};