module.exports = (api) => {
  // TODO: replace example script below

  api.user.self.getProfile()
    .then((profile) => {
      console.log(`Hi ${profile.name}, enjoy programming with CACCL!`);
    })
    .catch((err) => {
      console.log('An error occurred:', err.message, err.code);
    });
};
