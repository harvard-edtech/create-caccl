const initCACCL = require('caccl/script');
const fs = require('fs');
const path = require('path');

// Import script
const script = require('./script');

// Import helpers
const getCredentials = require('./helpers/getCredentials');

const main = async () => {
  // Get user's credentials
  const { canvasHost, accessToken } = await getCredentials();

  // Initialize CACCL
  const api = initCACCL({
    canvasHost,
    accessToken,
  });

  // Call script
  await script(api);
};

// Start main
main().catch(console.log);
