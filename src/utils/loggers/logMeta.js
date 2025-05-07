function logMeta(httpCode, level, signal) {
  let resolvedLevel = level;
  let resolvedSignal = signal;

  if (!resolvedLevel) {
    if (httpCode === 500) {
      resolvedLevel = 'error';
      resolvedSignal = 'E';
    } else if (httpCode !== 200 && httpCode !== '   ' && httpCode !== '-') {
      resolvedLevel = 'warn';
      resolvedSignal = 'W';
    } else {
      resolvedLevel = 'info';
      resolvedSignal = 'N';
    }
  } else {
    switch (resolvedLevel) {
      case 'error':
        resolvedSignal = 'E';
        break;
      case 'warn':
        resolvedSignal = 'W';
        break;
      case 'info':
        resolvedSignal = 'N';
        break;
      case 'debug':
        resolvedSignal = 'D';
        break;
    }
  }

  return { level: resolvedLevel, signal: resolvedSignal };
}

module.exports = logMeta;
