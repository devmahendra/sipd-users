const { format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

module.exports = new DailyRotateFile({
  filename: 'src/logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(
    format.timestamp(),
    format.printf(info => {
      return `${info.level} ${info.logTime} ${info.message}`;
    })
  )
});
