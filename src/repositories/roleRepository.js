const pool = require('../configs/db');

const getData = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const values = [limit, offset];

    const dataQuery = `
      SELECT * FROM roles
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const countQuery = `SELECT COUNT(*) FROM roles WHERE deleted_at IS NULL`;

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
    throw new Error(`Failed to get roles: ${error.message}`);
  }
};

const insertData = async ({ name, description, createdBy }) => {
  const query = `
    INSERT INTO roles (name, description, created_by)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [name, description, createdBy];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateData = async ({ id, name, description, updatedBy }) => {
  const query = `
    UPDATE roles
    SET name = $2, description = $3, updated_at = CURRENT_TIMESTAMP, updated_by = $4
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id, name, description, updatedBy];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteData = async ({ id, deletedAt, deletedBy }) => {
  const query = `
    UPDATE roles
    SET deleted_at = $2, deleted_by = $3
    WHERE id = $1
    RETURNING id;
  `;
  const values = [id, deletedAt, deletedBy];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { getData, insertData, updateData, deleteData };
