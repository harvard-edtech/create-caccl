const print = require('./print');

module.exports = (prompt) => {
  // Get access token
  print.subtitle('What\'s your Canvas access token?');
  console.log('Recommendation: add a "fake" user to your course and do the following as that user. You may have more privileges than typical users (the app can do more damage with your token). Using a "fake" user limits this risk.');
  console.log('');
  console.log('1. Log into Canvas, click the user picture (top left), click "Settings"');
  console.log('2. Scroll down and click "+ New Access Token"');
  console.log('3. Set purpose to "Dev Environment for <App Name>", leave expiry blank');
  console.log('4. Click "Generate Token"');
  console.log('');
  const accessToken = prompt('accessToken: ');
  console.log('');

  return accessToken;
}
