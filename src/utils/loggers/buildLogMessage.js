function buildLogMessage(context) {
    let msg = `reqId: ${context.requestId} seq: ${context.sequence} proccessName:${context.proccessName} signal:${context.signal} device:${context.device} ip:${context.ip} path:${context.method} ${context.path} statusCode:${context.statusCode}`;
    if (context.data) msg += ` data:${JSON.stringify(context.data)}`;
    if (context.reason) msg += ` reason:${context.reason}`;
    return msg;
  }
  
  module.exports = buildLogMessage;  