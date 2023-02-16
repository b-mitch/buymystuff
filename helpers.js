const db = require('./db/index');

const findByUsername = async (username) => {
  const text = 'SELECT * FROM users WHERE username = $1'
  const values = [username];
  return await db.query(text, values, (error, results) => {
    if (error) {
      console.log('error')
      throw error
    }
    console.log(results.rows);
    return results.rows;
  })
//   console.log(results);
//   return await results;
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