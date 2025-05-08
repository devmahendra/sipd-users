function logMeta(httpCode, level, signal) {
  let resolvedLevel = level;
  let resolvedSignal = signal;

  if (!resolvedLevel || resolvedLevel === 'debug') {
    if (httpCode === 500) {
      resolvedLevel = 'error';
      resolvedSignal = 'E';
    } else {
      resolvedLevel = 'info';
      resolvedSignal = 'N';
    }
  } 

  return { level: resolvedLevel, signal: resolvedSignal };
}

module.exports = logMeta;
