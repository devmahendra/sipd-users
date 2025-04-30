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

  const statusCode = logObject.statusCode || store?.get('statusCode') || '   ';

  // Auto-deduce level and signal
  let level = logObject.level;
  let signal = logObject.signal;

  if (!level) {
    if (statusCode === 500) {
      level = 'error';
    } else if (statusCode !== 200 && statusCode !== '   ') {
      level = 'warn';
    } else {
      level = 'info';
    }
  }

  if (!signal) {
    signal = statusCode !== 200 ? 'E' : 'S';
  }

  const context = {
    requestId: store?.get('requestId') || null,
    sequence: store?.get('sequence') || 1,
    signal,
    device: store?.get('device') || 0,
    ip: store?.get('ip') || 'N/A',
    method: store?.get('method') || 'N/A',
    path: addPadding(store?.get('path'), 50) || 'N/A',
    statusCode,
    proccessName: addPadding(logObject.proccessName, 25) || '',
    timestamp: now.toISOString(),
    logTime: formatDate(),
  };

  const reason = logObject.reason?.trim();
  if (reason && reason !== 'N/A') {
    context.reason = reason;
  }

  const data = {};
  if (Object.keys(requestBody).length) data.requestBody = requestBody;
  if (Object.keys(requestHeader).length) data.requestHeader = requestHeader;
  if (Object.keys(responseBody).length) data.responseBody = responseBody;
  if (Object.keys(responseHeader).length) data.responseHeader = responseHeader;
  if (Object.keys(data).length) context.data = data;

  let message = `reqId: ${context.requestId} seq: ${context.sequence} proccessName:${context.proccessName} signal:${context.signal} device:${context.device} ip:${context.ip} path:${context.method} ${context.path} statusCode:${context.statusCode} data:${JSON.stringify(context.data)}`;
  if (context?.reason) {
    message += ` reason:${context.reason}`;
  }

  mainLogger.log({
    appName: process.env.APP_NAME,
    level,
    message,
    ...context
  });

  logstashOnlyLogger.log({
    appName: process.env.APP_NAME,
    level,
    ...context
  });
};


module.exports = {
  logger: mainLogger,
  logData
};
