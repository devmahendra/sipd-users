// requestContext.js
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

const requestContext = (req, res, next) => {
  asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('requestId', req.headers['x-request-id']);
    asyncLocalStorage.getStore().set('sequence', 1);
    next();
  });
};

module.exports = requestContext;
