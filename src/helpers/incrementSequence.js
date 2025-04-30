// helpers/incrementSequence.js

const { asyncLocalStorage } = require('../utils/asyncContext');

const incrementSequence = () => {
  const store = asyncLocalStorage.getStore();
  if (store) {
    const currentSeq = store.get('sequence') || 1;
    store.set('signal', 'N');
    store.set('sequence', currentSeq + 1);
  }
};

module.exports = { incrementSequence };
