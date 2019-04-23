module.exports = async (api) => {
  // TODO: replace hello world script below

  const profile = await api.user.self.getProfile();
  console.log(`Hi ${profile.name}, this is your "hello world" script!`);
  console.log('Edit "script.js" then run "npm start"\n');
  console.log('Enjoy programming with CACCL!');
};
