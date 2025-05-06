const { transports, format } = require('winston');
const net = require('net');
const { Writable } = require('stream');
const { combine, timestamp, json } = format;

class LogstashTCPTransport extends transports.Stream {
  constructor({ host, port, maxRetries = 5, retryDelay = 2000 }) {
    let socket = new net.Socket();
    let retries = 0;
    let proccessName = 'LOGSTASH_CLIENT';

    const log = (logObject, mode = 2) => {
      const { logData } = require('../utils/loggers');
      logData(logObject, mode);
    };

    const connectSocket = () => {
      socket.connect(port, host, () => {
        log({
          level: 'info',
          proccessName,
          data: `Connected to Logstash at ${host}:${port}`,
        });
        retries = 0;
      });
    };

    const retryConnection = () => {
      if (retries < maxRetries) {
        retries++;
        const delay = retryDelay * retries;
        log({
          level: 'info',
          proccessName,
          data: `Retrying to connect to Logstash in ${delay}ms (attempt ${retries}/${maxRetries})`,
        });
        setTimeout(() => {
          // Remove listeners on the old socket before destroying
          socket.removeAllListeners();
          socket.destroy();

          // Create a new socket
          socket = new net.Socket();
          attachListeners();
          connectSocket();

          // Update the stream in Winston transport
          this.stream = socket;
        }, delay);
      } else {
        log({
          level: 'error',
          proccessName,
          data: `Max retry attempts reached. Giving up on Logstash connection.`,
        });
      }
    };

    const attachListeners = () => {
      socket.on('error', (err) => {
        log({
          level: 'error',
          proccessName,
          data: `Logstash TCP error: ${err.message}`,
        });
        retryConnection();
      });

      socket.on('close', () => {
        log({
          level: 'warn',
          proccessName,
          data: `Logstash TCP socket closed`,
        });
        retryConnection();
      });
    };

    attachListeners();
    connectSocket();

    super({
      stream: socket,
      format: combine(timestamp(), json()),
    });

    this.socket = socket;

    // 🚨 Catch stream-level errors to avoid crash
    this.on('error', (err) => {
      log({
        level: 'error',
        proccessName,
        data: `Winston Stream error: ${err.message}`,
      });
    });
  }
}

module.exports = LogstashTCPTransport;
