const pool = require('../configs/db');

const getUserByUsername = async (username) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
        SELECT *
        FROM users
        WHERE username = $1
    `, [username]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const getUserById = async (userId) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`
        SELECT 
            u.id AS user_id,
            u.username,
            up.first_name,
            up.last_name,
            up.email,
            up.phone_number,
            up.avatar_url,
            r.id AS role_id,
            r.name AS role_name,
            r.description AS role_description,
            rm.menu_id,
            rm.can_read,
            rm.can_create,
            rm.can_update,
            rm.can_delete
        FROM users u
        LEFT JOIN user_profile up ON up.user_id = u.id
        LEFT JOIN user_roles ur ON ur.user_id = u.id
        LEFT JOIN roles r ON r.id = ur.role_id
        LEFT JOIN role_menus rm ON rm.role_id = r.id
        WHERE u.id = $1
        `, [userId]);

        return result.rows;
    } catch (error) {
        throw new Error(`Failed to get user details: ${error.message}`);
    } finally {
        client.release();
    }
}

const storeRefreshToken = async (userId, token, refreshExpiresIn) => {
  const client = await pool.connect();
  try {
    await client.query(`
        INSERT INTO refresh_tokens (user_id, token, expires_at)
        VALUES ($1, $2, NOW() + $3::interval)
    `, [userId, token, refreshExpiresIn]);
  } finally {
    client.release();
  }
};

module.exports = { getUserByUsername, getUserById, storeRefreshToken };
