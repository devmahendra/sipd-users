// helpers/applyChangesFn.js
const { updateStatusById } = require('../repositories/sysRepository');

/**
 * Apply a status change to the given entity.
 *
 * @param {object} client - pg Client
 * @param {string} entityType - Table name
 * @param {number|string} entityId - Record ID
 * @param {string} status - New status (default 'approved')
 */
const applyStatusChange = async (client, entityType, entityId, status = 'approved') => {
  await updateStatusById(client, entityType, entityId, status);
};

module.exports = {
  applyStatusChange,
};
