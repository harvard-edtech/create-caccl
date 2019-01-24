module.exports = async (api) => {
  try {
    // Get user's profile from Canvas
    const profile = await api.user.self.getProfile();

    // Print hello world message
    console.log(`Hi ${profile.name}, it's a pleasure to meet you.`);
    console.log('This is your CACCL hello world app!\n');
    console.log('Edit "script.js" and run "npm start"');
  } catch (err) {
    console.log('Oops! An error occurred:', err.message, err.code);
  }
};
