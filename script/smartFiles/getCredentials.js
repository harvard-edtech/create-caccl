// Import modules
const fs = require('fs');
const path = require('path');
const initCACCL = require('caccl/script');

// Import helpers
const prompt = require('./prompt');
const print = require('./print');

const askForCredentials = async () => {
  // Get Canvas host
  let canvasHost;
  while (!canvasHost) {
    console.log('\n');
    print.title('Enter your Canvas Host');
    print.centered('example: canvas.harvard.edu');
    console.log('');
    const input = prompt('canvasHost: ').trim();

    // Show error if no host was given
    if (input.length === 0) {
      console.log('\n');
      print.error('That host doesn\'t look valid. Try again.');
    } else {
      // Valid host!
      canvasHost = input;
    }
  }

  // Get access token
  let accessToken;
  while (!accessToken) {
    console.log('\n');
    print.title('Enter a Canvas Access Token');
    console.log('');
    console.log('To interact with Canvas, we need an access token.');
    console.log('');

    print.subtitle('Generating an Access Token:');
    console.log('1. In Canvas, click: your picture (top left)');
    console.log('2. Click "Settings"');
    console.log('3. Click "+ New Access Token"');
    console.log('');

    const input = prompt('accessToken: ').trim();
    if (input.length === 0) {
      print.error('Oops! That access token was empty. Please try again');
      // Try again
    } else {
      // Verify the access token
      const api = initCACCL({
        accessToken: input,
        canvasHost,
      });
      try {
        await api.user.self.getProfile();
        // No errors occurred!
        accessToken = input;
      } catch (err) {
        console.log('');
        print.error(`Probably, that access token is invalid. If your Canvas host (${canvasHost}) is invalid or your internet is down, quit (ctrl + c) and restart`);
        console.log('');
        print.subtitle('press enter to continue');
        prompt('');
      }
    }
  }

  return {
    canvasHost,
    accessToken,
  };
};

module.exports = async () => {
  // Create config folder if it doesn't exist
  const configFolder = path.join(__dirname, '..', 'config');
  if (!fs.existsSync(configFolder)) {
    fs.mkdirSync(configFolder);
  }

  // Attempt to read in canvas host
  const canvasHostPath = path.join(
    __dirname,
    '..',
    'config',
    'canvasHost.txt'
  );
  const savedCanvasHost = (
    fs.existsSync(canvasHostPath)
      ? fs.readFileSync(canvasHostPath, 'utf-8')
      : null
  );

  // Attempt to read in access token
  const accessTokenPath = path.join(
    __dirname,
    '..',
    'config',
    'accessToken.txt'
  );
  const savedAccessToken = (
    fs.existsSync(accessTokenPath)
      ? fs.readFileSync(accessTokenPath, 'utf-8')
      : null
  );

  // Keep asking for verification until user accepts
  let canvasHost = (
    (savedCanvasHost && savedCanvasHost.trim().length > 0)
      ? savedCanvasHost
      : null
  );
  let accessToken = (
    (savedAccessToken && savedAccessToken.trim().length > 0)
      ? savedAccessToken
      : null
  );
  let verified;
  while (!verified) {
    if (!canvasHost || !accessToken) {
      // Need to ask user for credentials
      ({ canvasHost, accessToken } = await askForCredentials());
    } else {
      // Verify the credentials
      const api = initCACCL({
        accessToken,
        canvasHost,
      });
      try {
        const { name } = await api.user.self.getProfile();

        // Ask user to confirm themselves
        console.log('');
        print.subtitle(`Are you ${name}?`);
        console.log('- If this is you, press enter.');
        console.log(`- If you're not ${name}, type "n" and press enter.`);
        console.log('');
        verified = (prompt('').trim() !== 'n');
        if (verified) {
          // Save credentials to file
          fs.writeFileSync(canvasHostPath, canvasHost, 'utf-8');
          fs.writeFileSync(accessTokenPath, accessToken, 'utf-8');
        } else {
          // Credentials not verified. Ask again
          canvasHost = null;
          accessToken = null;
        }
      } catch (err) {
        // Invalid credentials! Ask again
        canvasHost = null;
        accessToken = null;
      }
    }
  }

  // Done! Resolve with canvasHost and accessToken
  return {
    canvasHost,
    accessToken,
  }
};
