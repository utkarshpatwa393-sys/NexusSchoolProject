const dataService = require('../services/dataService');

module.exports = {
  // GET /launchpad - Product Hunt style student projects showcase
  async getLaunchpad(req, res) {
    try {
      const trackFilter = req.query.track || '';
      const filter = trackFilter ? { track: trackFilter } : {};
      const projects = await dataService.getAllProjects(filter);

      res.render('pages/launchpad/index', {
        title: 'Student Project Launchpad | Nexus Institute of Technology',
        projects,
        currentTrack: trackFilter
      });
    } catch (err) {
      console.error('Launchpad load error:', err);
      res.render('pages/launchpad/index', {
        title: 'Launchpad | Nexus Institute of Technology',
        projects: [],
        currentTrack: ''
      });
    }
  },

  // GET /launchpad/new - Submit new project
  getNewProject(req, res) {
    res.render('pages/launchpad/new', {
      title: 'Deploy to Launchpad | Nexus Institute of Technology'
    });
  },

  // POST /launchpad/new - Create Project
  async postNewProject(req, res) {
    try {
      const { title, tagline, description, track, tags, imageUrl, demoUrl, githubUrl } = req.body;
      const user = req.session.user;

      if (!title || !tagline || !description) {
        req.flash('error', 'Title, tagline, and project description are required.');
        return res.redirect('/launchpad/new');
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);
      const tagList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : ['AI', 'NextGen'];

      await dataService.createProject({
        title,
        slug,
        tagline,
        description,
        creatorName: user.name,
        creatorEmail: user.email,
        creatorAvatar: user.avatar,
        user: user.id,
        track: track || 'AI Agents & LLMs',
        tags: tagList,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        demoUrl: demoUrl || '',
        githubUrl: githubUrl || '',
        badge: user.role === 'student' ? 'Nexus Student' : 'Fellowship Project'
      });

      req.flash('success', `Project "${title}" deployed live to the Nexus Launchpad!`);
      return res.redirect('/launchpad');
    } catch (err) {
      console.error('Error creating project:', err);
      req.flash('error', 'Failed to publish project to Launchpad.');
      return res.redirect('/launchpad/new');
    }
  },

  // POST /launchpad/:id/upvote - AJAX / Form Upvote
  async postUpvote(req, res) {
    try {
      const projectId = req.params.id;
      const voterId = req.session.user ? req.session.user.id : (req.ip || 'anon');
      const result = await dataService.toggleProjectUpvote(projectId, voterId);

      if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
        return res.json({ success: true, ...result });
      }

      return res.redirect('/launchpad');
    } catch (err) {
      console.error('Upvote error:', err);
      if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
        return res.status(500).json({ error: 'Failed to register upvote' });
      }
      return res.redirect('/launchpad');
    }
  }
};
