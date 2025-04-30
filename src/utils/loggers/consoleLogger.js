const { transports, format } = require('winston');

module.exports = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.printf(info => {
      return `${info.level} ${info.logTime} ${info.message}`;
    })
  )
});
