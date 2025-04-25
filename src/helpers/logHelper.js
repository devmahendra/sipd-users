const logger = require('../utils/logger');

function logEvent({
  message,
  routeId,
  routeName,
  processName,
  device = 0,
  signal = 'N',
  req = null,
  level = 'info',
  extra = {}
}) {
  const payload = {
    message,
    appName: process.env.LOGSTASH_INDEX_NAME,
    routeId,
    routeName,
    processName,
    device,
    signal,
    timestamp: new Date().toISOString(),
    ...(req?.ip ? { ip: req.ip } : {}),
    ...extra
  };

  logger.log({
    level,
    ...payload
  });
}

module.exports = logEvent;
