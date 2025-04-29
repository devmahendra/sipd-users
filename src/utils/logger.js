const winston = require('winston');
const { transports, format } = winston;
const LogstashTCPTransport = require('../configs/logstash'); // Assuming logstash transport is set correctly
const { getLogContext } = require('./logContext');

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
  const context = getLogContext();
  logger.log({
    level: logObject.level || 'info',
    ...context,
    message: logObject.proccessMessage,
    proccessName: logObject.proccessName,
    statusCode: logObject.statusCode,
    ...logObject,
  });
};

module.exports = {
  logger,
  logData // Export logData separately
};
