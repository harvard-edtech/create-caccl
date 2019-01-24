// Import CACCL
const initCACCL = require('caccl/server/react');

// Import configuration files
const developerCredentials = require('./config/developerCredentials');
const installationCredentials = require('./config/installationCredentials');
const canvasDefaults = require('./config/canvasDefaults');

// Initialize CACCL
const app = initCACCL({
  developerCredentials,
  installationCredentials,
  canvasHost: canvasDefaults.canvasHost,
});
