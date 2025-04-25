const { transports, format } = require('winston');
const net = require('net');
const { combine, timestamp, json } = format;

class LogstashTCPTransport extends transports.Stream {
  constructor({ host, port }) {
    const socket = new net.Socket();

    socket.connect(port, host, () => {
      console.log(`✅ Connected to Logstash at ${host}:${port}`);
    });

    socket.on('error', (err) => {
      console.error(`❌ Logstash TCP error: ${err.message}`);
    });

    socket.on('close', () => {
      console.warn('⚠️ Logstash TCP socket closed');
    });

    super({
      stream: socket,
      format: combine(timestamp(), json()),
    });

    this.socket = socket;
  }
}

module.exports = LogstashTCPTransport;
