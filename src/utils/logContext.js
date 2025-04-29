// logContext.js
const { asyncLocalStorage } = require('./asyncContext');

function getLogContext() {
  const store = asyncLocalStorage.getStore();
  if (!store) return {};
  return Object.fromEntries(store.entries());
}

module.exports = {
  getLogContext
};
