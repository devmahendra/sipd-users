const { createLogger, format, transports } = require('winston');
const LogstashTCPTransport = require('../configs/logstash');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.json()
  ),
  transports: [
    new LogstashTCPTransport({
      host: process.env.LOGSTASH_HOST,
      port: parseInt(process.env.LOGSTASH_PORT),
    })
  ],
});

module.exports = logger;
