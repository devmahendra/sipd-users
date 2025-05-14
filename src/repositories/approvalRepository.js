const pool = require('../configs/db');

const getData = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const values = [parseInt(limit), parseInt(offset)];

    const dataQuery = `
      SELECT *
      FROM approvals
      ORDER BY requested_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const countQuery = `SELECT COUNT(*) FROM approvals`;

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

const insertApproval = async (client, { entityType, entityId, changes, actionType, requestedBy }) => {
    const query = `
      INSERT INTO approvals (entity_type, entity_id, changes, action_type, requested_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, status, requested_at;
    `;
    const values = [entityType, entityId, JSON.stringify(changes), actionType, requestedBy];
    const result = await client.query(query, values);
    return result.rows[0];
};
  
const approveEntity = async (client, { approvalId, entityType, entityId, approvedBy }) => {
    const updateApprovalQuery = `
      UPDATE approvals
      SET status = 'approved', approved_by = $1, approved_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND status = 'pending'
      RETURNING *;
    `;
    const approvalResult = await client.query(updateApprovalQuery, [approvedBy, approvalId]);
    return approvalResult.rows[0];
};
  
module.exports = {
  getData,
  insertApproval,
  approveEntity,
};
  