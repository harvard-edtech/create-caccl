const print = require('./print');

/* eslint-disable no-console */

module.exports = (prompt) => {
  // Get Canvas host
  print.subtitle('Which Canvas host should your app connect to by default?');
  print.centered('e.g. canvas.harvard.edu or canvas.instructure.com');
  const canvasHost = prompt('canvasHost: ').trim();
  console.log('');
  return canvasHost;
};
