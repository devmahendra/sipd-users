// utils/logger.js
const winston = require('winston');
const { transports, format } = winston;
const LogstashTCPTransport = require('../configs/logstash'); // Assuming logstash transport is set correctly
const { asyncLocalStorage } = require('../utils/asyncContext'); // Import asyncLocalStorage from asyncContext

// Custom log level mapping
const logLevels = {
  info: 0,
  warn: 1,
  error: 2,
  debug: 3
};

const logger = winston.createLogger({
  levels: logLevels,
  transports: [
    new transports.Console({ format: format.combine(format.colorize(), format.simple()) }),
    new LogstashTCPTransport({ host: '192.168.4.38', port: 5044 }) // Logstash transport
  ]
});

// Custom log function to add context from AsyncLocalStorage
const logData = (logObject) => {
  const context = asyncLocalStorage.getStore(); // Fetch context from AsyncLocalStorage
  const contextData = context || {}; // Default to an empty object if no context is available

  logger.log({
    level: logObject.level,
    appName: process.env.APP_NAME,
    message: logObject.proccessMessage,
    proccessName: logObject.proccessName,
    requestId: contextData.requestId || 'N/A',
    sequence: contextData.sequence || 1,
    signal: contextData.signal || 'N',
    device: contextData.device || 'N/A',
    ip: contextData.ip || 'N/A',
    method: contextData.method || 'N/A',
    path: contextData.path || 'N/A',
    timestamp: new Date().toISOString(),
    ...logObject // Spread other data if needed
  });
};

module.exports = {
  logger,
  logData // Export logData separately
};
