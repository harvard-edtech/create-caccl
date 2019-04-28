const initCACCL = require('caccl/script');

// Import script
const script = require('./script');

// Import helpers
const getCredentials = require('./helpers/getCredentials');
const prompt = require('./helpers/prompt');

const main = async () => {
  // Get user's credentials
  const { canvasHost, accessToken } = await getCredentials();

  // Initialize CACCL
  const api = initCACCL({
    canvasHost,
    accessToken,
  });

  // Call script
  try {
    await script(api, prompt);
  } catch (err) {
    // Print error
    /* eslint-disable no-console */
    console.log('\nAn error occurred while running your script:');
    console.log(err);
  }
};

// Start main
main().catch(console.log);
