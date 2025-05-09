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

const insertUser = async (client, { username, password, createdBy }) => {
  const query = `
    INSERT INTO users (username, password, created_by)
    VALUES ($1, $2, $3)
    RETURNING id, username, created_at;
  `;
  const values = [username, password, createdBy];
  const result = await client.query(query, values);
  return result.rows[0];
};

const insertUserProfile = async (client, { userId, firstName, lastName, email, phoneNumber }) => {
  const query = `
    INSERT INTO user_profile (user_id, first_name, last_name, email, phone_number)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, user_id, first_name, last_name, email, phone_number;
  `;
  const values = [userId, firstName, lastName, email, phoneNumber];
  const result = await client.query(query, values);
  return result.rows[0];
};

const insertUserRole = async (client, { userId, roleId }) => {
  const query = `
    INSERT INTO user_roles (user_id, role_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, role_id) DO NOTHING
    RETURNING *;
  `;
  const values = [userId, roleId];
  const result = await client.query(query, values);
  return result.rows[0];
};

const updateUser = async (client, { id, password, updatedBy }) => {
  const query = `
    UPDATE users
    SET password = $2, updated_by = $3
    WHERE id = $1
    RETURNING id, updated_at;
  `;
  const values = [id, password, updatedBy];
  const result = await client.query(query, values);
  return result.rows[0];
};

const updateUserProfile = async (client, { userId, firstName, lastName, email, phoneNumber }) => {
  const query = `
    UPDATE user_profile
    SET first_name = $2,
        last_name = $3,
        email = $4,
        phone_number = $5
    WHERE user_id = $1
    RETURNING id;
  `;
  const values = [userId, firstName, lastName, email, phoneNumber];
  const result = await client.query(query, values);
  return result.rows[0];
};

const updateUserRole = async (client, { userId, roleId }) => {
  const query = `
    UPDATE user_roles
    SET role_id = $2
    WHERE user_id = $1
    RETURNING *;
  `;
  const values = [userId, roleId];
  const result = await client.query(query, values);
  return result.rows[0];
};

const deleteData = async ({ id, deletedAt, deletedBy }) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const deleteUserQuery = `
      UPDATE users
      SET deleted_at = $2, deleted_by = $3
      WHERE id = $1
      RETURNING id;
    `;
    await client.query(deleteUserQuery, [id, deletedAt, deletedBy]);

    await client.query('COMMIT');

    return deleteUserQuery;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};



module.exports = { 
  getUserByUsername, 
  getUserById, 
  storeRefreshToken, 
  getData, 
  insertUser, 
  insertUserProfile,
  insertUserRole,
  updateUser,
  updateUserProfile,
  updateUserRole,
  deleteData 
};
