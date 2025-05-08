const { asyncLocalStorage } = require('../asyncContext');
const { addPadding } = require('../../helpers/padding');

function getLogContext(logObject, now, formatDate) {
  const store = asyncLocalStorage.getStore();
  const currentSeq = store?.get('sequence') || 1;
  const isSystemLog = !store?.get('requestId') && !logObject.requestId;

  const requestContext = {
    requestId: addPadding(store?.get('requestId'), 36) || 'N/A',
    sequence: currentSeq,
    device: addPadding(store?.get('device'), 5) || 0,
    signal: store?.get('signal') || 'N',
    ip: addPadding(store?.get('ip'), 15) || 'N/A',
    method: addPadding(store?.get('method'), 10) || 'N/A',
    path: addPadding(store?.get('path'), 50) || 'N/A',
    proccessName: addPadding(logObject.proccessName, 25) || addPadding('', 25),
    httpCode: logObject.httpCode || store?.get('httpCode') || addPadding('', 3),
    timestamp: now.toISOString(),
    logTime: formatDate(),
    data:
      typeof logObject.data === 'string'
        ? { message: logObject.data }
        : logObject.data || store?.get('data') || {}
  }

  const systemContext = {
    proccessName: addPadding(logObject.proccessName, 25) || addPadding('', 25),
    timestamp: now.toISOString(),
    logTime: formatDate(),
    data:
      typeof logObject.data === 'string'
        ? { message: logObject.data }
        : logObject.data || store?.get('data') || {}
  }

  return isSystemLog ? systemContext : requestContext;
}

module.exports = getLogContext;
