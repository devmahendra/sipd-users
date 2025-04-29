// requestLogger.js
const { asyncLocalStorage } = require('../utils/asyncContext');
const { v4: uuidv4 } = require('uuid');
const { logData } = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();

  const store = asyncLocalStorage.getStore();

  if (store) {
    store.set('requestId', requestId);
    store.set('signal', 'R');
    store.set('appName', 'sipd-users');
    store.set('device', req.headers['user-agent'] || 'N/A');
    store.set('method', req.method || 'N/A');
    store.set('path', req.originalUrl || 'N/A');
    store.set('ip', req.headers['x-forwarded-for'] || req.ip || 'N/A');
    store.set('sequence', 1);  // Initial sequence set to 1 for the request
  }

  logData({
    level: 'info',
    proccessName: 'REQUEST_RECEIVED',
    proccessMessage: `Received ${req.method} ${req.originalUrl}`,
  });

  // Increment sequence for next log
  const incrementSequence = () => {
    const store = asyncLocalStorage.getStore();
    if (store) {
      const currentSeq = store.get('sequence') || 1;
      store.set('sequence', currentSeq + 1);  // Increment the sequence
    }
  };

  res.on('finish', () => {
    // Set signal to 'S' and log the response
    const store = asyncLocalStorage.getStore();
    if (store) {
      store.set('signal', 'S');
      incrementSequence();  // Increment sequence before logging response
    }

    logData({
      level: 'info',
      proccessName: 'RESPONSE_SENT',
      proccessMessage: `Responded with ${res.statusCode}`,
      statusCode: res.statusCode,
    });
  });

  // Increment sequence for the next log point after receiving request
  incrementSequence();

  next();
};

module.exports = { requestLogger };
