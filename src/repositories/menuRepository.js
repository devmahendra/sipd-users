const pool = require('../configs/db');

const getData = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const values = [limit, offset];

    const dataQuery = `
      SELECT * FROM menus
      WHERE deleted_at IS NULL
      ORDER BY sort_order ASC
      LIMIT $1 OFFSET $2
    `;
    const countQuery = `SELECT COUNT(*) FROM menus WHERE deleted_at IS NULL`;

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
    throw new Error(`Failed to get menus: ${error.message}`);
  }
};

const insertData = async ({ name, path, icon, parentId, sortOrder, createdBy }) => {
  const query = `
    INSERT INTO menus (name, path, icon, parent_id, sort_order, created_by)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [name, path, icon, parentId, sortOrder, createdBy];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateData = async ({ id, name, path, icon, parentId, sortOrder, updatedBy }) => {
  const query = `
    UPDATE menus
    SET name = $2, path = $3, icon = $4, parent_id = $5, sort_order = $6, updated_at = CURRENT_TIMESTAMP, updated_by = $7
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id, name, path, icon, parentId, sortOrder, updatedBy];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteData = async ({ id, deletedAt, deletedBy }) => {
  const query = `
    UPDATE menus
    SET deleted_at = $2, deleted_by = $3
    WHERE id = $1
    RETURNING id;
  `;
  const values = [id, deletedAt, deletedBy];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = { getData, insertData, updateData, deleteData };
