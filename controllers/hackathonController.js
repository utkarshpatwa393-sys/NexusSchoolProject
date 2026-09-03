const dataService = require('../services/dataService');

module.exports = {
  // GET /hackathons - List hackathons
  async getHackathons(req, res) {
    try {
      const hackathons = await dataService.getAllHackathons();
      res.render('pages/hackathons/index', {
        title: 'Bitwise Cyber Arena & Hackathons | Bitwise School of Technology',
        hackathons
      });
    } catch (err) {
      console.error('Error loading hackathons:', err);
      res.render('pages/hackathons/index', {
        title: 'Hackathons | Bitwise School of Technology',
        hackathons: []
      });
    }
  },

  // GET /hackathons/:slug - Single hackathon details
  async getHackathonDetail(req, res) {
    try {
      const { slug } = req.params;
      const hackathon = await dataService.getHackathonBySlug(slug);

      if (!hackathon) {
        req.flash('error', 'Hackathon not found in the cyber registry.');
        return res.redirect('/hackathons');
      }

      const isRegistered = req.session.user && hackathon.registeredUsers
        ? hackathon.registeredUsers.some(u => (u._id || u).toString() === req.session.user.id)
        : false;

      res.render('pages/hackathons/show', {
        title: `${hackathon.title} | Bitwise School of Technology`,
        hackathon,
        isRegistered
      });
    } catch (err) {
      console.error('Error loading hackathon details:', err);
      req.flash('error', 'Unable to retrieve hackathon details.');
      return res.redirect('/hackathons');
    }
  },

  // POST /hackathons/:id/register
  async postRegister(req, res) {
    try {
      if (!req.session.user) {
        req.flash('error', 'Please log in to register for hackathons.');
        return res.redirect('/auth/login');
      }

      const hackathonId = req.params.id;
      const updated = await dataService.registerUserForHackathon(hackathonId, req.session.user.id);

      if (updated) {
        req.flash('success', `Registration confirmed for ${updated.title}! Your builder seat is secured.`);
        return res.redirect(`/hackathons/${updated.slug}`);
      }

      req.flash('error', 'Failed to complete registration.');
      return res.redirect('/hackathons');
    } catch (err) {
      console.error('Hackathon registration error:', err);
      req.flash('error', 'Error processing registration.');
      return res.redirect('/hackathons');
    }
  }
};
