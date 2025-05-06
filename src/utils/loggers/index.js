const mainLogger = require('./mainLogger');
const logstashOnlyLogger = require('./logstashOnlyLogger');
const getLogContext = require('./getLogContext');
const logMeta = require('./logMeta');
const buildLogMessage = require('./buildLogMessage');
const { formatDate } = require('../../helpers/dateFormatter');
const { incrementSequence } = require('../../helpers/incrementSequence');

const logData = (logObject, mode = 1) => {
  const now = new Date();
  const context = getLogContext(logObject, now, formatDate);
  incrementSequence(logObject.level);
  const { level, signal } = logMeta(context.statusCode, logObject.level, context.signal);
  
  context.level = level;
  context.signal = signal;
  
  if (logObject.reason?.trim()) {
    context.reason = logObject.reason.trim();
  }
  
  const message = buildLogMessage(context);

  mainLogger.log({
    appName: process.env.APP_NAME,
    level,
    message,
    ...context
  });

  if (mode === 1) {
    logstashOnlyLogger.log({
      appName: process.env.APP_NAME,
      level,
      ...context
    });
  }
};

module.exports = {
  logger: mainLogger,
  logData
};