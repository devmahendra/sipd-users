function logMeta(httpCode, level, signal) {
  let resolvedLevel = level;
  let resolvedSignal = signal;

  if (!resolvedLevel) {
    if (httpCode === 500) {
      resolvedLevel = 'error';
      resolvedSignal = 'E';
    } else {
      resolvedLevel = 'info';
      resolvedSignal = 'N';
    }
  } else if (resolvedLevel === 'error') {
    if (httpCode === 500) {
      resolvedSignal = 'E';
    } else {
      resolvedSignal = 'N';
    }
  } else if (resolvedLevel === 'debug') {
    if (httpCode === 500) {
      resolvedSignal = 'E';
    } else {
      resolvedSignal = 'N';
    }
  }
  return { level: resolvedLevel, signal: resolvedSignal };
}

module.exports = logMeta;
