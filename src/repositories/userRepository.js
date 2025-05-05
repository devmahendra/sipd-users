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
        ON CONFLICT (user_id) DO UPDATE
        SET token = EXCLUDED.token,
        expires_at = EXCLUDED.expires_at,
        created_at = NOW(),
        revoked = false;
    `, [userId, token, refreshExpiresIn]);
  } finally {
    client.release();
  }
};

const getData = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const values = [parseInt(limit), parseInt(offset)];

    const dataQuery = `
      SELECT
        u.id,
        u.username,
        up.first_name,
        up.last_name,
        up.email,
        u.status
      FROM users u
      JOIN user_profile up ON up.user_id = u.id
      WHERE u.deleted_at IS NULL
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `SELECT COUNT(*) FROM users WHERE deleted_at IS NULL`;

    const { rows: data } = await pool.query(dataQuery, values);
    const { rows } = await pool.query(countQuery);
    const totalRecords = parseInt(rows[0].count);

    return {
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: parseInt(page),
      data,
    };
  } catch (error) {
    throw new Error(`Failed to get data: ${error.message}`);
  }
};

module.exports = { getUserByUsername, getUserById, storeRefreshToken, getData };
