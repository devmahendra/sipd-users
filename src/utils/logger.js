const winston = require('winston');
const { asyncLocalStorage } = require('./asyncContext');
const { addPadding } = require('../helpers/padding');
const { formatDate } = require('../helpers/dateFormatter');

// Transports
const consoleLogger = require('./loggers/consoleLogger');
const fileLogger = require('./loggers/fileLogger');
const logstashLogger = require('./loggers/logstashLogger');

// Custom log levels
const logLevels = {
  info: 0,
  warn: 1,
  error: 2,
  debug: 3
};

// Create main logger (with message)
const mainLogger = winston.createLogger({
  levels: logLevels,
  transports: [consoleLogger, fileLogger],
});

// Create logstash-only logger (no message)
const logstashOnlyLogger = winston.createLogger({
  levels: logLevels,
  transports: [logstashLogger],
});

// Centralized logData
const logData = (logObject) => {
  const store = asyncLocalStorage.getStore();
  const now = new Date();
  const context = {
    requestId: store?.get('requestId') || null,
    sequence: store?.get('sequence') || 1,
    signal: store?.get('signal') || 'N',
    device: store?.get('device') || 0,
    ip: store?.get('ip') || 'N/A',
    method: store?.get('method') || 'N/A',
    path: addPadding(store?.get('path'), 50) || 'N/A',
    statusCode: logObject.statusCode || 'N/A',
    proccessName: addPadding(logObject.proccessName, 25) || '',
    data: store?.get('data') || {
      requestHeader: {},
      requestBody: {},
      responseHeader: {},
      responseBody: {}
    },
    timestamp: now.toISOString(),
    logTime: formatDate(),
  };

  const message = `reqId: ${context.requestId} seq: ${context.sequence} proccessName:${context.proccessName} signal:${context.signal} device:${context.device} ip:${context.ip} path:${context.method} ${context.path} status:${context.statusCode} data:${JSON.stringify(context.data)}`;

  // Log to normal logger (with message)
  mainLogger.log({
    appName: process.env.APP_NAME,
    level: logObject.level || 'info',
    message,
    ...context
  });

  // Log to logstash (without message)
  logstashOnlyLogger.log({
    appName: process.env.APP_NAME,
    level: logObject.level || 'info',
    ...context // NO message
  });
};

module.exports = {
  logger: mainLogger,
  logData
};
