const dataService = require('../services/dataService');

module.exports = {
  // GET /admin - Admissions Command Center
  async getDashboard(req, res) {
    try {
      const { track, status } = req.query;
      const filter = {};
      if (track) filter.track = track;
      if (status) filter.status = status;

      const applications = await dataService.getAllApplications(filter);
      const stats = await dataService.getAdmissionsStats();
      const mentors = await dataService.getAllMentors();
      const hackathons = await dataService.getAllHackathons();
      const projects = await dataService.getAllProjects();

      res.render('pages/admin/dashboard', {
        title: 'Admissions Command Center | Bitwise School of Technology',
        applications,
        stats,
        mentorsCount: mentors.length,
        hackathonsCount: hackathons.length,
        projectsCount: projects.length,
        selectedTrack: track || '',
        selectedStatus: status || ''
      });
    } catch (err) {
      console.error('Admin dashboard error:', err);
      res.render('pages/admin/dashboard', {
        title: 'Admissions Command Center',
        applications: [],
        stats: { totalApplications: 0, acceptedCount: 0, underReviewCount: 0, acceptanceRate: '0.0', trackBreakdown: {} },
        mentorsCount: 0,
        hackathonsCount: 0,
        projectsCount: 0,
        selectedTrack: '',
        selectedStatus: ''
      });
    }
  },

  // GET /admin/applications/:id - Review Single Application Dossier
  async getApplicationDetail(req, res) {
    try {
      const application = await dataService.getApplicationById(req.params.id);

      if (!application) {
        req.flash('error', 'Application dossier not found.');
        return res.redirect('/admin');
      }

      res.render('pages/admin/application-detail', {
        title: `Review Dossier: ${application.applicationId} | Bitwise Command Center`,
        application
      });
    } catch (err) {
      console.error('Error fetching application detail:', err);
      req.flash('error', 'Failed to retrieve application dossier.');
      return res.redirect('/admin');
    }
  },

  // POST /admin/applications/:id/status - Update Status & Reviewer Notes
  async postUpdateApplicationStatus(req, res) {
    try {
      const { status, reviewerScore, reviewerNote } = req.body;
      const updated = await dataService.updateApplicationStatus(
        req.params.id,
        status,
        reviewerNote,
        reviewerScore
      );

      if (updated) {
        req.flash('success', `Application status updated to [${status.toUpperCase()}] with score ${reviewerScore || 0}/100.`);
      } else {
        req.flash('error', 'Application update failed.');
      }

      return res.redirect(`/admin/applications/${req.params.id}`);
    } catch (err) {
      console.error('Error updating application status:', err);
      req.flash('error', 'Database error during status update.');
      return res.redirect(`/admin/applications/${req.params.id}`);
    }
  },

  // GET /admin/content - Manage Mentors & Hackathons
  async getManageContent(req, res) {
    try {
      const mentors = await dataService.getAllMentors();
      const hackathons = await dataService.getAllHackathons();
      const projects = await dataService.getAllProjects();

      res.render('pages/admin/manage-content', {
        title: 'Content & Faculty Command | Bitwise School of Technology',
        mentors,
        hackathons,
        projects
      });
    } catch (err) {
      console.error('Manage content error:', err);
      res.render('pages/admin/manage-content', {
        title: 'Manage Content',
        mentors: [],
        hackathons: [],
        projects: []
      });
    }
  },

  // POST /admin/mentors/new
  async postCreateMentor(req, res) {
    try {
      const { name, role, company, avatarUrl, bio, domain, expertise } = req.body;
      const expList = expertise ? expertise.split(',').map(e => e.trim()).filter(Boolean) : [];

      await dataService.createMentor({
        name,
        role,
        company,
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio,
        domain: domain || 'AI & LLMs',
        expertise: expList
      });

      req.flash('success', `Faculty mentor ${name} (${company}) added successfully.`);
      return res.redirect('/admin/content');
    } catch (err) {
      console.error('Create mentor error:', err);
      req.flash('error', 'Failed to create mentor profile.');
      return res.redirect('/admin/content');
    }
  },

  // POST /admin/hackathons/new
  async postCreateHackathon(req, res) {
    try {
      const { title, tagline, theme, description, prizePool, startDate, endDate, registrationDeadline, tags } = req.body;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
      const tagList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : ['Hackathon', 'AI'];

      await dataService.createHackathon({
        title,
        slug,
        tagline,
        theme,
        description,
        prizePool: prizePool || '$50,000 Cash + GPU Credits',
        startDate: new Date(startDate || Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(endDate || Date.now() + 9 * 24 * 60 * 60 * 1000),
        registrationDeadline: new Date(registrationDeadline || Date.now() + 6 * 24 * 60 * 60 * 1000),
        tags: tagList,
        status: 'active'
      });

      req.flash('success', `Hackathon ${title} published live.`);
      return res.redirect('/admin/content');
    } catch (err) {
      console.error('Create hackathon error:', err);
      req.flash('error', 'Failed to create hackathon.');
      return res.redirect('/admin/content');
    }
  }
};
