// Import modules
const fs = require('fs');
const path = require('path');
const initCACCL = require('caccl/script');

// Import helpers
const prompt = require('./prompt');
const print = require('./print');

// Helper to pull user's name
const verifyToken = (accessToken, canvasHost) => {
  const api = initCACCL({
    accessToken,
    canvasHost,
  });
  return api.user.self.getProfile()
    .then((profile) => {
      console.log('');
      print.subtitle(`Are you ${profile.name}?`);
      console.log('If this is you, press enter.');
      console.log(`If you're not ${profile.name}, type "n" and press enter.`);
      console.log('');
      const response = prompt('');
      return (response !== 'n');
    })
    .catch((err) => {
      console.log(err, err.message, err.code);
      print.error('Oops! This access token is invalid.');
      return false;
    });
};

module.exports = (canvasHost) => {
  // Create config folder if it doesn't exist
  const configFolder = path.join(__dirname, '..', 'config');
  if (!fs.existsSync(configFolder)) {
    fs.mkdirSync(configFolder);
  }

  // Attempt to read in access token
  const tokenConfigFilename = path.join(
    __dirname,
    '..',
    'config',
    'accessToken.txt'
  );
  const savedAccessToken = (
    fs.existsSync(tokenConfigFilename)
      ? fs.readFileSync(tokenConfigFilename, 'utf-8')
      : null
  );

  // If we have an access token, confirm with the user
  const checkIfSavedTokenIsOkay = (
    savedAccessToken
    // Verify with user:
    ? verifyToken(savedAccessToken, canvasHost)
    // No token! Saved token is not okay:
    : Promise.resolve(false)
  );

  // If token isn't okay, ask for a new token until we get a good token
  return checkIfSavedTokenIsOkay.then((savedTokenIsOkay) => {
    if (savedTokenIsOkay) {
      return savedAccessToken;
    }

    // Need to ask user for token
    const askForToken = () => {
      return new Promise((resolve, reject) => {
        console.log('\n\n');
        print.title('Enter a Canvas Access Token');
        console.log('');
        console.log('To interact with Canvas, we need an access token.');
        console.log('');

        print.subtitle('Generating an Access Token:');
        console.log('1. In Canvas, click: your picture (top left)');
        console.log('2. Click "Settings"');
        console.log('3. Click "+ New Access Token"');
        console.log('');

        const accessToken = prompt('accessToken: ').trim();
        if (accessToken.length === 0) {
          print.error('Oops! That access token was empty. Please try again');
          // Try again
          return askForToken().then(resolve).catch(reject);
        }

        // Try to verify the token
        verifyToken(accessToken, canvasHost)
          .then((valid) => {
            if (valid) {
              // Save the access token
              fs.writeFileSync(tokenConfigFilename, accessToken, 'utf-8');
              return resolve(accessToken);
            }
            // Try again
            console.log('...let\'s try again.');
            return askForToken().then(resolve).catch(reject);
          });
      });
    };
    return askForToken();
  });
};
