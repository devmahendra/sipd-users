// src/configs/logstash.js

const { transports, format } = require('winston');
const net = require('net');
const { combine, timestamp, json } = format;

class LogstashTCPTransport extends transports.Stream {
  constructor({ host, port, maxRetries = 5, retryDelay = 2000 }) {
    let socket = new net.Socket();
    let retries = 0;

    const connectSocket = () => {
      socket.connect(port, host, () => {
        console.log(`✅ Connected to Logstash at ${host}:${port}`);
        retries = 0; // Reset retry count after successful connection
      });
    };

    socket.on('error', (err) => {
      console.error(`❌ Logstash TCP error: ${err.message}`);
      retryConnection();
    });

    socket.on('close', () => {
      console.warn('⚠️ Logstash TCP socket closed');
      retryConnection();
    });

    const retryConnection = () => {
      if (retries < maxRetries) {
        retries++;
        const delay = retryDelay * retries;
        console.log(`🔁 Retrying to connect to Logstash in ${delay}ms (attempt ${retries}/${maxRetries})`);
        setTimeout(() => {
          socket.destroy(); // Ensure old socket is closed
          socket = new net.Socket(); // Create new socket for retry
          attachListeners(); // Reattach listeners
          connectSocket();
        }, delay);
      } else {
        console.error('🚫 Max retry attempts reached. Giving up on Logstash connection.');
      }
    };

    const attachListeners = () => {
      socket.on('error', (err) => {
        console.error(`❌ Logstash TCP error: ${err.message}`);
        retryConnection();
      });

      socket.on('close', () => {
        console.warn('⚠️ Logstash TCP socket closed');
        retryConnection();
      });
    };

    connectSocket();

    super({
      stream: socket,
      format: combine(timestamp(), json()),
    });

    this.socket = socket;
  }
}

module.exports = LogstashTCPTransport;
