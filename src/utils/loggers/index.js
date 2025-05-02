const mainLogger = require('./mainLogger');
const logstashOnlyLogger = require('./logstashOnlyLogger');
const getLogContext = require('./getLogContext');
const logMeta = require('./logMeta');
const buildLogMessage = require('./buildLogMessage');
const { formatDate } = require('../../helpers/dateFormatter');

const logData = (logObject) => {
  const now = new Date();
  const context = getLogContext(logObject, now, formatDate);
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