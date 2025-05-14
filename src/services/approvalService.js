const pool = require('../configs/db');
const approvalRepository = require('../repositories/approvalRepository');
const { handlePostgresError } = require('../utils/errorDbHandler');
const { applyStatusChange } = require('../helpers/applyChanges');

const getData = async (page, limit) => {
  try {
      const result = await approvalRepository.getData(page, limit);
      return result;
  } catch (error) {
      throw error;
  }
};

const insertApproval = async (client, { entityType, entityId, changes, actionType, requestedBy }) => {
  try {
    const approval = await approvalRepository.insertApproval(client, {
      entityType,
      entityId,
      changes,
      actionType,
      requestedBy,
    });
    return approval;
  } catch (error) {
    const { message, httpCode } = handlePostgresError(error);
    error.message = message;
    error.httpCode = httpCode;
    throw error;
  }
};

const approveEntity = async ({ approvalId, entityType, entityId, approvedBy, approvedAt, status }) => {
  console.log('approveEntity', { approvalId, entityType, entityId, approvedBy, approvedAt, status });
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      const approval = await approvalRepository.approveEntity(client, {
        approvalId,
        entityType,
        entityId,
        status,
        approvedBy,
        approvedAt,
      });
  
      if (!approval) {
        throw new Error('Approval not found or already processed');
      }
  
      await applyStatusChange(client, entityType, entityId, status);
  
      await client.query('COMMIT');
      return { success: true };
    } catch (error) {
      await client.query('ROLLBACK');
      const { message, httpCode } = handlePostgresError(error);
      error.message = message;
      error.httpCode = httpCode;
      throw error;
    } finally {
      client.release();
    }
};

module.exports = {
  getData,
  insertApproval,
  approveEntity,
};
