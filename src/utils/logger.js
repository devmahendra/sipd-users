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
  level: process.env.LOG_LEVEL || 'info',
  transports: [consoleLogger, fileLogger],
});

// Create logstash-only logger (no message)
const logstashOnlyLogger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  transports: [logstashLogger],
});

// Centralized logData
const logData = (logObject) => {
  const store = asyncLocalStorage.getStore();
  const now = new Date();

  const requestBody = store?.get('data')?.requestBody || {};
  const requestHeader = store?.get('data')?.requestHeader || {};
  const responseBody = store?.get('data')?.responseBody || {};
  const responseHeader = store?.get('data')?.responseHeader || {};

  const context = {
    requestId: store?.get('requestId') || null,
    sequence: store?.get('sequence') || 1,
    signal: logObject.signal || store?.get('signal') || 'N',
    device: store?.get('device') || 0,
    ip: store?.get('ip') || 'N/A',
    method: store?.get('method') || 'N/A',
    path: addPadding(store?.get('path'), 50) || 'N/A',
    statusCode: logObject.statusCode || '   ',
    reason: logObject.reason || 'N/A',
    proccessName: addPadding(logObject.proccessName, 25) || '',
    timestamp: now.toISOString(),
    logTime: formatDate(),
  };

  if (logObject.reason && logObject.reason.trim() !== '') {
    context.reason = logObject.reason;
  }
  if (Object.keys(requestBody).length > 0) {
    context.data = context.data || {};
    context.data.requestBody = requestBody;
  }
  if (Object.keys(requestHeader).length > 0) {
    context.data = context.data || {};
    context.data.requestHeader = requestHeader;
  }
  if (Object.keys(responseBody).length > 0) {
    context.data = context.data || {};
    context.data.responseBody = responseBody;
  }
  if (Object.keys(responseHeader).length > 0) {
    context.data = context.data || {};
    context.data.responseHeader = responseHeader;
  }
  if (Object.keys(responseHeader).length > 0) {
    context.data = context.data || {};
    context.data.responseHeader = responseHeader;
  }

  let message = `reqId: ${context.requestId} seq: ${context.sequence} proccessName:${context.proccessName} signal:${context.signal} device:${context.device} ip:${context.ip} path:${context.method} ${context.path} statusCode:${context.statusCode} data:${JSON.stringify(context.data)}`;
  
  if (context.reason !== undefined && context.reason !== null && context.reason !== 'N/A') {
    message += ` reason:${context.reason}`;
  }

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
