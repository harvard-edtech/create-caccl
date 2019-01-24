const initCACCL = require('caccl/script');
const fs = require('fs');
const path = require('path');

// Import script
const script = require('./script');

// Import helpers
const getCanvasHost = require('./helpers/getCanvasHost');
const getAccessToken = require('./helpers/getAccessToken');

// Get canvas host
const canvasHost = getCanvasHost(prompt);

// Get access token, initialize CACCL, then run script
getAccessToken(promptcanvasHost)
  .then((accessToken) => {
    // Initialize CACCL
    const api = initCACCL({
      accessToken,
      canvasHost,
    });

    console.log('\n\n');

    // Call script
    script(api);
  });
