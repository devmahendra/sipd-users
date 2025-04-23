const pool = require('../configs/db');

const getUserByUsername = async (username) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT *
      FROM users
      WHERE username = $1
    `, [username]);
    return result.rows;
  } finally {
    client.release();
  }
};

const storeRefreshToken = async (userId, token, refreshExpiresIn) => {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '$3')
    `, [userId, token, refreshExpiresIn]);
  } finally {
    client.release();
  }
};

module.exports = { getUserByUsername, storeRefreshToken };
