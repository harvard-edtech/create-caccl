const print = require('./print');

/* eslint-disable no-console */

module.exports = (prompt) => {
  // Get access token
  print.subtitle('Do you have Canvas access tokens to add?');
  console.log('Recommendation: add one or more "fake" users to your course and do the following as those users. You may have more privileges than typical users (the app can do more damage with your token). Using "fake" users limits this risk.');
  console.log('');
  console.log('1. Log into Canvas, click the user picture (top left), click "Settings"');
  console.log('2. Scroll down and click "+ New Access Token"');
  console.log('3. Set purpose to "Dev Environment for <App Name>", leave expiry blank');
  console.log('4. Click "Generate Token"');
  console.log('');
  const instructorAccessToken = prompt('Instructor access token: ');

  const roles = ['students', 'tas'];
  const accessTokens = {
    instructor: instructorAccessToken,
    students: [],
    tas: [],
  };
  roles.forEach((role) => {
    console.log('');
    const addTokens = prompt(`Add access tokens for ${role}? y/n: `, true);
    if (addTokens === 'y') {
      let accessToken = '';
      do {
        accessToken = prompt('Access token: ', true);
        if (accessToken !== '') {
          accessTokens[role].push(accessToken);
        }
      } while (accessToken !== '');
    }
  });

  console.log('');
  return accessTokens;
};
