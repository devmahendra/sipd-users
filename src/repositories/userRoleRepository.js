const pool = require('../configs/db');

const getData = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const values = [limit, offset];

    const dataQuery = `
      SELECT 
        ur.id,
        ur.user_id,
        ur.role_id,
        u.username,
        r.name AS role_name
      FROM user_roles ur
      JOIN users u ON u.id = ur.user_id
      JOIN roles r ON r.id = ur.role_id
      ORDER BY ur.id DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `SELECT COUNT(*) FROM user_roles`;

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
    throw new Error(`Failed to get user_roles: ${error.message}`);
  }
};

const insertData = async ({ userId, roleId }) => {
  const query = `
    INSERT INTO user_roles (user_id, role_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, role_id) DO NOTHING
    RETURNING *;
  `;
  const values = [userId, roleId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateData = async ({ id, roleId }) => {
  const query = `
    UPDATE user_roles
    SET role_id = $2
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id, roleId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteData = async ({ id }) => {
  const query = `DELETE FROM user_roles WHERE id = $1 RETURNING id;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = { getData, insertData, updateData, deleteData };
