const pool = require('../configs/db');
const ALLOWED_TABLES = require('../constants/allowedTables');

const getRoutes = async () => {
    const query = `
      SELECT id, name, path, method, description, protected, menu_id, action_type 
      FROM routes 
      WHERE status = 'approved'
    `;
  
    const { rows } = await pool.query(query);
    return rows;
  };

  const updateStatusById = async (client, tableName, id, status) => {
    if (!ALLOWED_TABLES.includes(tableName)) {
      throw new Error(`Table "${tableName}" is not allowed for status updates`);
    }
  
    const query = `
      UPDATE ${tableName}
      SET status = $1
      WHERE id = $2
    `;
    const values = [status, id];
  
    await client.query(query, values);
  };
  
  module.exports = { getRoutes, updateStatusById };