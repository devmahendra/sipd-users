const pool = require('../configs/db');

const getRoutes = async () => {
    const query = `
      SELECT id, name, path, method, description, protected, menu_id, action_type 
      FROM routes 
      WHERE status = 'approved'
    `;
  
    const { rows } = await pool.query(query);
    return rows;
  };
  
  module.exports = { getRoutes };