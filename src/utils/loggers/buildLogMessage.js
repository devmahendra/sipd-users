function buildLogMessage(context) {
    let msg = `reqId: ${context.requestId} seq: ${context.sequence} proccessName:${context.proccessName} signal:${context.signal} device:${context.device} ip:${context.ip} path:${context.method} ${context.path} httpCode:${context.httpCode}`;
    if (context.data) msg += ` data:${JSON.stringify(context.data)}`;
    return msg;
  }
  
  module.exports = buildLogMessage;  