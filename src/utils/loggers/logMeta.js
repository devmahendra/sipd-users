function logMeta(statusCode, level, signal) {
  let resolvedLevel = level;
  let resolvedSignal = signal;

  if (!resolvedLevel) {
    if (statusCode === 500) {
      resolvedLevel = 'error',
      resolvedSignal = 'E';
    }
    else if (statusCode !== 200 && statusCode !== '   ' && signal !== 'S') {
      resolvedLevel = 'warn',
      resolvedSignal = 'W';
    }
    else resolvedLevel = 'info';
  }

  return { level: resolvedLevel, signal: resolvedSignal };
}

module.exports = logMeta;
