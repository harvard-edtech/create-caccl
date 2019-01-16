'use strict';

var nodeVersion = process.versions.node;
var parts = nodeVersion.split('.');
var majorVersion = parts[0];

if (majorVersion < 8) {
  console.error('Oops! You are running node version ' + majorVersion + '.');
  console.log('CACCL requires Node 8 or higher. Please update your version of Node.');
  return;
}

require('./index.js');
