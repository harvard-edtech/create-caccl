const path = require('path');

module.exports = (app) => {
  // TODO: replace placeholder content
  app.get('/', async (req, res) => {
    if (!req.api) {
      // Not logged in
      return res.send('Please launch this app via Canvas.');
    }

    try {
      // Get user profile
      const profile = await req.api.user.self.getProfile();

      // Render the index page
      return res.render(path.join(__dirname, 'views', 'index'), {
        name: profile.name,
      });
    } catch (err) {
      return res.send(`An error occurred: ${err.message}`);
    }
  });
};
