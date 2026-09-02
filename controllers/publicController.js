const dataService = require('../services/dataService');

module.exports = {
  // GET / - Home Cyber Portal
  async getHome(req, res) {
    try {
      const mentors = await dataService.getAllMentors();
      const hackathons = await dataService.getAllHackathons({ status: 'active' });
      const projects = await dataService.getAllProjects();
      const featuredProjects = projects.slice(0, 3);
      const featuredMentors = mentors.slice(0, 4);

      res.render('pages/home', {
        title: 'Nexus Institute of Technology | The Next-Gen AI & Tech Campus',
        mentors: featuredMentors,
        hackathons: hackathons.length > 0 ? hackathons : (await dataService.getAllHackathons()).slice(0, 2),
        projects: featuredProjects
      });
    } catch (err) {
      console.error('Error loading home page:', err);
      res.render('pages/home', {
        title: 'Nexus Institute of Technology',
        mentors: [],
        hackathons: [],
        projects: []
      });
    }
  },

  // GET /programs - Degree & Fellowship Tracks
  async getPrograms(req, res) {
    res.render('pages/programs', {
      title: 'Academic & Venture Programs | Nexus Institute of Technology'
    });
  },

  // GET /curriculum - 4-Year Interactive Matrix
  async getCurriculum(req, res) {
    res.render('pages/curriculum', {
      title: 'AI-First Curriculum Matrix | Nexus Institute of Technology'
    });
  },

  // GET /mentors - Mentors Directory
  async getMentors(req, res) {
    try {
      const domainFilter = req.query.domain || '';
      const filter = domainFilter ? { domain: domainFilter } : {};
      const mentors = await dataService.getAllMentors(filter);

      res.render('pages/mentors', {
        title: 'Faculty & Industry Mentors | Nexus Institute of Technology',
        mentors,
        currentDomain: domainFilter
      });
    } catch (err) {
      console.error('Error loading mentors:', err);
      res.render('pages/mentors', {
        title: 'Mentors | Nexus Institute of Technology',
        mentors: [],
        currentDomain: ''
      });
    }
  },

  // GET /hackerhouse - Campus Life, NVIDIA H100 GPU Pods & Labs
  async getHackerhouse(req, res) {
    res.render('pages/hackerhouse', {
      title: '24/7 Hackerhouse & GPU Cluster | Nexus Institute of Technology'
    });
  },

  // GET /tuition - Tuition, Scholarships & ISA Simulator
  async getTuition(req, res) {
    res.render('pages/tuition', {
      title: 'Tuition, Fellowships & Income Share Agreement (ISA) | Nexus Institute of Technology'
    });
  }
};
