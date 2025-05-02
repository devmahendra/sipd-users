const { asyncLocalStorage } = require('../asyncContext');
const { addPadding } = require('../../helpers/padding');

function getLogContext(logObject, now, formatDate) {
  const store = asyncLocalStorage.getStore();

  return {
    requestId: store?.get('requestId') || null,
    sequence: store?.get('sequence') || 1,
    device: store?.get('device') || 0,
    signal: store?.get('signal') || N,
    ip: store?.get('ip') || 'N/A',
    method: store?.get('method') || 'N/A',
    path: addPadding(store?.get('path'), 50) || 'N/A',
    proccessName: addPadding(logObject.proccessName, 25) || '',
    statusCode: logObject.statusCode || store?.get('statusCode') || '   ',
    timestamp: now.toISOString(),
    logTime: formatDate(),
    data: store?.get('data') || {}
  };
}

module.exports = getLogContext;
