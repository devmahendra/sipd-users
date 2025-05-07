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
  } 

  return { level: resolvedLevel, signal: resolvedSignal };
}

module.exports = logMeta;
