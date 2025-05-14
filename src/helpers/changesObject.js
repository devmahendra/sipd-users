const { maskSensitive } = require('./mask');

/**
 * Build a structured changes object for approval tracking.
 * Compares old and new values, masking sensitive ones.
 *
 * @param {Object} oldData - Existing entity data from DB
 * @param {Object} newData - New payload data to compare
 * @returns {Object} - JSONB-ready changes object
 */
function buildChangesObject(oldData = {}, newData = {}) {
  const changes = {};

  for (const key of Object.keys(newData)) {
    const oldValue = oldData[key];
    const newValue = newData[key];

    // Skip if values are equal
    if (oldValue === newValue) continue;

    const masked = maskSensitive({ [key]: newValue });
    const maskedOld = maskSensitive({ [key]: oldValue });

    changes[key] = {
      old: maskedOld[key] ?? null,
      new: masked[key] ?? null,
    };
  }

  return changes;
}
  
module.exports = buildChangesObject;  