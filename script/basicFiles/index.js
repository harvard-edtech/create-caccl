const initCACCL = require('caccl/script');
const fs = require('fs');
const path = require('path');

// Import script
const script = require('./script');

// Create config file paths
const canvasHostPath = path.join(__dirname, 'config', 'canvasHost.txt');
const accessTokenPath = path.join(__dirname, 'config', 'accessToken.txt');

// Verify that files exist
const canvasHostExists = fs.existsSync(canvasHostPath);
const accessTokenExists = fs.existsSync(accessTokenPath);
if (!canvasHostExists || !accessTokenExists) {
  console.log('To run this script, you need to add your Canvas credentials:');
  if (!canvasHostExists) {
    console.log('- Put your Canvas host in config/canvasHost.txt (e.g., "canvas.harvard.edu")');
  }
  if (!accessTokenExists) {
    console.log('- Put your access token in config/accessToken.txt');
    console.log('    How to get an access token:');
    console.log('    - in Canvas, click your picture');
    console.log('    - click "Settings"');
    console.log('    - click "+ Access Token"');
  }
  console.log('');
  process.exit(0);
}

// Get credentials
const canvasHost = fs.readFileSync(canvasHostPath, 'utf-8').trim();
const accessToken = fs.readFileSync(accessTokenPath, 'utf-8').trim();

// Initialize CACCL
const api = initCACCL({
  accessToken,
  canvasHost,
});

// Run the script
script(api);
