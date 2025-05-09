const pool = require('../configs/db');

const getData = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const values = [limit, offset];

    const dataQuery = `
      SELECT 
        rm.id,
        r.name AS role_name,
        m.name AS menu_name,
        rm.role_id,
        rm.menu_id,
        rm.can_read,
        rm.can_create,
        rm.can_update,
        rm.can_delete
      FROM role_menus rm
      JOIN roles r ON r.id = rm.role_id
      JOIN menus m ON m.id = rm.menu_id
      ORDER BY rm.id DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `SELECT COUNT(*) FROM role_menus`;

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
    throw new Error(`Failed to get role_menus: ${error.message}`);
  }
};

const insertData = async ({ roleId, menuId, canRead, canCreate, canUpdate, canDelete }) => {
  const query = `
    INSERT INTO role_menus (role_id, menu_id, can_read, can_create, can_update, can_delete)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (role_id, menu_id) DO NOTHING
    RETURNING *;
  `;
  const values = [roleId, menuId, canRead, canCreate, canUpdate, canDelete];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateData = async ({ id, canRead, canCreate, canUpdate, canDelete }) => {
  const query = `
    UPDATE role_menus
    SET can_read = $2,
        can_create = $3,
        can_update = $4,
        can_delete = $5
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id, canRead, canCreate, canUpdate, canDelete];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteData = async ({ id }) => {
  const query = `DELETE FROM role_menus WHERE id = $1 RETURNING id;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = { getData, insertData, updateData, deleteData };
