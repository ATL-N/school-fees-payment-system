const path = require('path');

module.exports = {
  // ... other configuration options ...

  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
    },
  },
};
