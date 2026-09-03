const dataService = require('../services/dataService');

module.exports = {
  // GET /dashboard - Unified Student / Applicant Portal
  async getDashboard(req, res) {
    try {
      const user = await dataService.findUserById(req.session.user.id) || req.session.user;
      const application = await dataService.getApplicationByUserId(user.id || user._id);
      const allProjects = await dataService.getAllProjects();
      const userProjects = allProjects.filter(p => (p.user?._id || p.user)?.toString() === (user.id || user._id)?.toString() || p.creatorEmail === user.email);
      const hackathons = await dataService.getAllHackathons();
      const upcomingHackathon = hackathons.find(h => h.status === 'active' || h.status === 'upcoming') || hackathons[0];
      const mentors = await dataService.getAllMentors();

      res.render('pages/dashboard/index', {
        title: 'Bitwise Student HUD & Dashboard | Bitwise School of Technology',
        user,
        application,
        userProjects,
        upcomingHackathon,
        mentors: mentors.slice(0, 3)
      });
    } catch (err) {
      console.error('Dashboard load error:', err);
      res.render('pages/dashboard/index', {
        title: 'Dashboard | Bitwise School of Technology',
        user: req.session.user,
        application: null,
        userProjects: [],
        upcomingHackathon: null,
        mentors: []
      });
    }
  },

  // POST /dashboard/profile
  async postUpdateProfile(req, res) {
    try {
      const { bio, githubUsername, avatar } = req.body;
      const updatedUser = await dataService.updateUser(req.session.user.id, {
        bio,
        githubUsername,
        avatar: avatar || req.session.user.avatar
      });

      if (updatedUser) {
        req.session.user.bio = updatedUser.bio;
        req.session.user.githubUsername = updatedUser.githubUsername;
        req.session.user.avatar = updatedUser.avatar;
      }

      req.flash('success', 'Neural ID credentials updated successfully.');
      return res.redirect('/dashboard');
    } catch (err) {
      console.error('Update profile error:', err);
      req.flash('error', 'Failed to update profile.');
      return res.redirect('/dashboard');
    }
  }
};
