  /**
   * Helper function to pad a tag with custom width (for specific tags like processName).
   * @param {string} label - The tag name (e.g. 'process').
   * @param {string} value - The value to pad.
   * @returns {string} - The formatted string with specific padding.
   */
  const addPadding = (value, width) => {
    // Example: for 'process', we pad it to 25 characters.
    const val = (value || '-').toString();
    return `${val.padEnd(width)}`;
  };
  
  module.exports = { addPadding };
  