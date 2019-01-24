const initCACCL = require('caccl/script');
const fs = require('fs');
const path = require('path');

// Import configuration files
const canvasDefaults = require('./config/canvasDefaults');

// Import script
const script = require('./script');

// Get access token
const accessTokenPath = path.join(__dirname, 'config', 'accessToken.js');
const accessToken = fs.readFileSync(accessTokenPath, 'utf-8');

// Initialize CACCL
const api = initCACCL({
  accessToken,
  canvasHost: canvasDefaults.canvasHost,
});

// Run the script
script(api);
