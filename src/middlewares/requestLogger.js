const { asyncLocalStorage } = require('../utils/asyncContext');
const { v4: uuidv4 } = require('uuid');
const { logData } = require('../utils/logger');
const { maskSensitive } = require('../helpers/mask');

const requestLogger = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  const store = asyncLocalStorage.getStore();

  if (store) {
    store.set('requestId', requestId);
    store.set('signal', 'R');
    store.set('appName', 'sipd-users');
    store.set('device', 1 || 'N/A');
    store.set('method', req.method || 'N/A');
    store.set('path', req.originalUrl || 'N/A');
    store.set('ip', req.headers['x-forwarded-for'] || req.ip || 'N/A');
    store.set('sequence', 1);

    const data = {
      requestHeader: maskSensitive(req.headers || {}),
      requestBody: maskSensitive(req.body || {}),
      responseHeader: {},
      responseBody: {},
    };
    store.set('data', data);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    const store = asyncLocalStorage.getStore();
    if (store) {
      const data = store.get('data') || {};
      data.responseBody = maskSensitive(body || {});
      store.set('data', data);
    }
    return originalJson(body);
  };

  const originalSend = res.send.bind(res);
  res.send = (body) => {
    const store = asyncLocalStorage.getStore();
    if (store) {
      const data = store.get('data') || {};
      try {
        data.responseBody = maskSensitive(typeof body === 'string' ? JSON.parse(body) : body);
      } catch (err) {
        data.responseBody = maskSensitive(body);
      }
      store.set('data', data);
    }
    return originalSend(body);
  };

  const incrementSequence = () => {
    const store = asyncLocalStorage.getStore();
    if (store) {
      const currentSeq = store.get('sequence') || 1;
      store.set('signal', 'N');
      store.set('sequence', currentSeq + 1);
    }
  };

  res.on('finish', () => {
    const store = asyncLocalStorage.getStore();
    if (store) {
      incrementSequence();
      store.set('signal', 'S');

      const data = store.get('data') || {};
      data.responseHeader = maskSensitive(res.getHeaders() || {});
      store.set('data', data);

      logData({
        level: 'info',
        proccessName: 'RESPONSE_SENT',
        proccessMessage: `Responded with ${res.statusCode}`,
        statusCode: res.statusCode,
      });
    }
  });

  logData({
    level: 'info',
    proccessName: 'REQUEST_RECEIVED',
    proccessMessage: `Received ${req.method} ${req.originalUrl}`,
  });

  incrementSequence();
  next();
};

module.exports = { requestLogger };
