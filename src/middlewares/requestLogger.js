// requestLogger.js
const { asyncLocalStorage } = require('../utils/asyncContext');
const { v4: uuidv4 } = require('uuid');
const { logData } = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();

  const context = {
    requestId,
    sequence: 1,
    signal: 'R', // R = Request, S = Response
    appName: 'sipd-users',
    device: req.headers['user-agent'] || 'N/A',
    method: req.method || 'N/A',
    path: req.originalUrl || 'N/A',
    ip: req.headers['x-forwarded-for'] || req.ip || 'N/A',
  };

  // SET THE CONTEXT HERE
  asyncLocalStorage.run(context, () => {
    logData({
      level: 'info',
      proccessName: 'REQUEST_RECEIVED',
      proccessMessage: `Received ${req.method} ${req.originalUrl}`,
    });

    res.on('finish', () => {
      const store = asyncLocalStorage.getStore();
      asyncLocalStorage.enterWith({
        ...store,
        signal: 'S',
        sequence: store.sequence + 1,
      });

      logData({
        level: 'info',
        proccessName: 'RESPONSE_SENT',
        proccessMessage: `Responded with ${res.statusCode}`,
        statusCode: res.statusCode,
      });
    });

    next();
  });
};

module.exports = { requestLogger };
