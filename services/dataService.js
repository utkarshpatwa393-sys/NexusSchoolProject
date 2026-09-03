const mongoose = require('mongoose');
const User = require('../models/User');
const Application = require('../models/Application');
const Project = require('../models/Project');
const Hackathon = require('../models/Hackathon');
const Mentor = require('../models/Mentor');
const bcrypt = require('bcryptjs');
const { seedMentors, seedHackathons, seedProjects, seedUsers } = require('../seed/seedData');

// In-Memory storage fallback state
let memoryState = {
  users: [],
  applications: [],
  projects: [],
  hackathons: [],
  mentors: []
};

// Seed in-memory storage immediately on module load
async function initMemoryState() {
  // Seed users with hashed passwords
  memoryState.users = await Promise.all(
    seedUsers.map(async (u, idx) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return {
        _id: `user_mem_${idx + 1}`,
        ...u,
        password: hashedPassword,
        comparePassword: async function(candidate) {
          return bcrypt.compare(candidate, this.password);
        }
      };
    })
  );

  // Seed mentors
  memoryState.mentors = seedMentors.map((m, idx) => ({
    _id: `mentor_mem_${idx + 1}`,
    ...m
  }));

  // Seed hackathons
  memoryState.hackathons = seedHackathons.map((h, idx) => ({
    _id: `hackathon_mem_${idx + 1}`,
    ...h
  }));

  // Seed projects
  memoryState.projects = seedProjects.map((p, idx) => ({
    _id: `project_mem_${idx + 1}`,
    ...p,
    upvotedBy: []
  }));

  // Seed sample applications
  const sampleUser = memoryState.users.find(u => u.email === 'priya.patel@gmail.com') || memoryState.users[0];
  memoryState.applications = [
    {
      _id: 'app_mem_1',
      applicationId: 'BITWISE-APP-894120',
      user: sampleUser._id,
      track: 'btech-ai-cs',
      status: 'under_review',
      personalDetails: {
        fullName: 'Priya Patel',
        email: 'priya.patel@gmail.com',
        phone: '+91 98765 43210',
        city: 'Bangalore',
        country: 'India',
        githubUrl: 'https://github.com/priyapatel-tech',
        portfolioUrl: 'https://priyapatel.dev',
        linkedinUrl: 'https://linkedin.com/in/priyapatel'
      },
      academicBackground: {
        highestEducation: 'Grade 12 / Senior Secondary (CBSE)',
        schoolOrCollege: 'National Public School, Indiranagar',
        graduationYear: 2026,
        gpaOrPercentage: '96.4%',
        standardizedTestScore: 'JEE Main: 99.2 Percentile'
      },
      technicalExperience: {
        experienceLevel: 'advanced',
        primaryLanguages: ['Python', 'Rust', 'TypeScript', 'PyTorch'],
        bestProjectUrl: 'https://github.com/priyapatel-tech/autonomous-research-agent',
        bestProjectDescription: 'Built an autonomous paper-summarizing and code-reproduction agent using Claude 3.5 Sonnet and vector databases.',
        hackathonsAttended: 3
      },
      essayChallenge: {
        visionEssay: 'With 10,000 H100 GPU compute hours at Bitwise, I will train a decentralized neural-symbolic reasoning engine capable of formal mathematical verification in real-time.',
        whyBitwise: 'Traditional colleges teach 20-year-old C++ syntax and rote definitions. Bitwise is the only institution where I can sit next to OpenAI researchers and ship production systems from day one.',
        whyNexus: 'Traditional colleges teach 20-year-old C++ syntax and rote definitions. Bitwise is the only institution where I can sit next to OpenAI researchers and ship production systems from day one.',
        founderAmbition: 'I want to build and venture-back an open-source Autonomous Software Engineering foundry in India for global enterprises.'
      },
      fundingPreference: 'income_share_agreement',
      reviewerScore: 92,
      reviewerNotes: [
        {
          author: 'Bitwise Admissions Board',
          note: 'Outstanding GitHub project demonstration with clear deep learning mastery. Fast-tracked for Founder Fellowship interview.',
          timestamp: new Date()
        }
      ],
      timeline: [
        {
          title: 'Application Submitted',
          description: 'Application dossier received and verified.',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          status: 'submitted'
        },
        {
          title: 'Technical Portfolio Review',
          description: 'Scored 92/100 by AI Admissions evaluation pipeline.',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: 'under_review'
        }
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }
  ];
}

initMemoryState();

// Helper to check if Mongoose is connected
function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

const dataService = {
  isMongoConnected,

  // --- USER METHODS ---
  async findUserByEmail(email) {
    if (isMongoConnected()) {
      return await User.findOne({ email: email.toLowerCase().trim() });
    }
    const user = memoryState.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    return user || null;
  },

  async findUserById(id) {
    if (isMongoConnected()) {
      return await User.findById(id);
    }
    const user = memoryState.users.find(u => u._id.toString() === id.toString());
    return user || null;
  },

  async createUser(userData) {
    if (isMongoConnected()) {
      const user = new User(userData);
      return await user.save();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newUser = {
      _id: `user_mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...userData,
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      studentId: userData.role === 'student' || userData.role === 'admin' ? `BST-2026-${rand}` : null,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: userData.bio || 'Building the next generation of autonomous AI systems & software engines.',
      computeHours: userData.role === 'admin' ? 9999 : 120,
      badgeTier: userData.role === 'admin' ? 'Bitwise Staff / Admin' : 'Novice Builder',
      createdAt: new Date(),
      comparePassword: async function(candidate) {
        return bcrypt.compare(candidate, this.password);
      }
    };
    memoryState.users.push(newUser);
    return newUser;
  },

  async getAllUsers() {
    if (isMongoConnected()) {
      return await User.find().sort({ createdAt: -1 });
    }
    return [...memoryState.users];
  },

  async updateUser(id, updateData) {
    if (isMongoConnected()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    }
    const idx = memoryState.users.findIndex(u => u._id.toString() === id.toString());
    if (idx !== -1) {
      memoryState.users[idx] = { ...memoryState.users[idx], ...updateData };
      return memoryState.users[idx];
    }
    return null;
  },

  // --- MENTOR METHODS ---
  async getAllMentors(filter = {}) {
    if (isMongoConnected()) {
      return await Mentor.find(filter).sort({ isFoundingAdvisor: -1, name: 1 });
    }
    let list = [...memoryState.mentors];
    if (filter.domain) {
      list = list.filter(m => m.domain === filter.domain);
    }
    return list;
  },

  async getMentorById(id) {
    if (isMongoConnected()) {
      return await Mentor.findById(id);
    }
    return memoryState.mentors.find(m => m._id.toString() === id.toString()) || null;
  },

  async createMentor(mentorData) {
    if (isMongoConnected()) {
      const mentor = new Mentor(mentorData);
      return await mentor.save();
    }
    const newMentor = {
      _id: `mentor_mem_${Date.now()}`,
      ...mentorData,
      createdAt: new Date()
    };
    memoryState.mentors.push(newMentor);
    return newMentor;
  },

  // --- HACKATHON METHODS ---
  async getAllHackathons(filter = {}) {
    if (isMongoConnected()) {
      return await Hackathon.find(filter).sort({ startDate: 1 });
    }
    let list = [...memoryState.hackathons];
    if (filter.status) {
      list = list.filter(h => h.status === filter.status);
    }
    return list;
  },

  async getHackathonBySlug(slug) {
    if (isMongoConnected()) {
      return await Hackathon.findOne({ slug });
    }
    return memoryState.hackathons.find(h => h.slug === slug) || null;
  },

  async registerUserForHackathon(hackathonId, userId) {
    if (isMongoConnected()) {
      return await Hackathon.findByIdAndUpdate(
        hackathonId,
        {
          $addToSet: { registeredUsers: userId },
          $inc: { participantCount: 1 }
        },
        { new: true }
      );
    }
    const h = memoryState.hackathons.find(item => item._id.toString() === hackathonId.toString());
    if (h) {
      if (!h.registeredUsers) h.registeredUsers = [];
      if (!h.registeredUsers.includes(userId.toString())) {
        h.registeredUsers.push(userId.toString());
        h.participantCount = (h.participantCount || 0) + 1;
      }
      return h;
    }
    return null;
  },

  async createHackathon(data) {
    if (isMongoConnected()) {
      const hack = new Hackathon(data);
      return await hack.save();
    }
    const newHack = {
      _id: `hack_mem_${Date.now()}`,
      ...data,
      participantCount: 1,
      createdAt: new Date()
    };
    memoryState.hackathons.push(newHack);
    return newHack;
  },

  // --- PROJECT LAUNCHPAD METHODS ---
  async getAllProjects(filter = {}) {
    if (isMongoConnected()) {
      return await Project.find(filter).sort({ upvotes: -1, createdAt: -1 });
    }
    let list = [...memoryState.projects];
    if (filter.track) {
      list = list.filter(p => p.track === filter.track);
    }
    return list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
  },

  async getProjectById(id) {
    if (isMongoConnected()) {
      return await Project.findById(id);
    }
    return memoryState.projects.find(p => p._id.toString() === id.toString()) || null;
  },

  async createProject(projectData) {
    if (isMongoConnected()) {
      const proj = new Project(projectData);
      return await proj.save();
    }
    const newProj = {
      _id: `proj_mem_${Date.now()}`,
      ...projectData,
      upvotes: 1,
      upvotedBy: [],
      createdAt: new Date()
    };
    memoryState.projects.unshift(newProj);
    return newProj;
  },

  async toggleProjectUpvote(projectId, voterId) {
    if (isMongoConnected()) {
      const proj = await Project.findById(projectId);
      if (!proj) return null;
      const index = proj.upvotedBy.indexOf(voterId);
      if (index === -1) {
        proj.upvotedBy.push(voterId);
        proj.upvotes += 1;
      } else {
        proj.upvotedBy.splice(index, 1);
        proj.upvotes = Math.max(0, proj.upvotes - 1);
      }
      await proj.save();
      return { upvotes: proj.upvotes, hasUpvoted: index === -1 };
    }

    const proj = memoryState.projects.find(p => p._id.toString() === projectId.toString());
    if (!proj) return null;
    if (!proj.upvotedBy) proj.upvotedBy = [];
    const index = proj.upvotedBy.indexOf(voterId);
    let hasUpvoted = false;
    if (index === -1) {
      proj.upvotedBy.push(voterId);
      proj.upvotes = (proj.upvotes || 0) + 1;
      hasUpvoted = true;
    } else {
      proj.upvotedBy.splice(index, 1);
      proj.upvotes = Math.max(0, (proj.upvotes || 1) - 1);
      hasUpvoted = false;
    }
    return { upvotes: proj.upvotes, hasUpvoted };
  },

  // --- APPLICATION METHODS ---
  async createApplication(appData) {
    if (isMongoConnected()) {
      const app = new Application(appData);
      return await app.save();
    }
    const num = Math.floor(100000 + Math.random() * 900000);
    const newApp = {
      _id: `app_mem_${Date.now()}`,
      applicationId: `BITWISE-APP-${num}`,
      ...appData,
      status: 'submitted',
      reviewerScore: 0,
      reviewerNotes: [],
      timeline: [
        {
          title: 'Application Dossier Submitted',
          description: 'Your application has been received and encrypted in the Bitwise Admissions Vault.',
          date: new Date(),
          status: 'submitted'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryState.applications.push(newApp);
    return newApp;
  },

  async getAllApplications(filter = {}) {
    if (isMongoConnected()) {
      return await Application.find(filter).populate('user').sort({ createdAt: -1 });
    }
    let list = [...memoryState.applications];
    if (filter.track) {
      list = list.filter(a => a.track === filter.track);
    }
    if (filter.status) {
      list = list.filter(a => a.status === filter.status);
    }
    return list.map(app => {
      const user = memoryState.users.find(u => u._id.toString() === (app.user?._id || app.user)?.toString());
      return { ...app, user: user || null };
    });
  },

  async getApplicationById(id) {
    if (isMongoConnected()) {
      return await Application.findById(id).populate('user');
    }
    const app = memoryState.applications.find(a => a._id.toString() === id.toString() || a.applicationId === id);
    if (!app) return null;
    const user = memoryState.users.find(u => u._id.toString() === (app.user?._id || app.user)?.toString());
    return { ...app, user: user || null };
  },

  async getApplicationByUserId(userId) {
    if (isMongoConnected()) {
      return await Application.findOne({ user: userId }).sort({ createdAt: -1 });
    }
    return memoryState.applications.find(a => (a.user?._id || a.user)?.toString() === userId.toString()) || null;
  },

  async updateApplicationStatus(id, newStatus, reviewerNote, reviewerScore) {
    const statusMap = {
      under_review: {
        title: 'Technical Review In Progress',
        desc: 'Admissions committee is evaluating your codebase and problem-solving essay.'
      },
      tech_assessment: {
        title: 'Cognitive & Systems Assessment Invited',
        desc: 'Candidate has been invited for the 90-minute live systems design challenge.'
      },
      interview_scheduled: {
        title: 'Founder / Faculty 1:1 Scheduled',
        desc: 'Live interview with Bitwise Faculty and Industry Mentors booked.'
      },
      accepted: {
        title: 'Admissions Offer Extended (Cohort 2026)',
        desc: 'Welcome to Bitwise! Your fellowship agreement and onboarding dossier are issued.'
      },
      waitlisted: {
        title: 'Placed on Priority Waitlist',
        desc: 'Application held for secondary quota evaluation.'
      },
      rejected: {
        title: 'Application Decision Finalized',
        desc: 'Admissions cycle closed for this track.'
      }
    };

    if (isMongoConnected()) {
      const app = await Application.findById(id);
      if (!app) return null;
      app.status = newStatus;
      if (reviewerScore !== undefined && reviewerScore !== null && reviewerScore !== '') {
        app.reviewerScore = Number(reviewerScore);
      }
      if (reviewerNote && reviewerNote.trim()) {
        app.reviewerNotes.push({
          author: 'Bitwise Admissions Board',
          note: reviewerNote.trim(),
          timestamp: new Date()
        });
      }
      if (statusMap[newStatus]) {
        app.timeline.push({
          title: statusMap[newStatus].title,
          description: statusMap[newStatus].desc,
          date: new Date(),
          status: newStatus
        });
      }
      return await app.save();
    }

    const app = memoryState.applications.find(a => a._id.toString() === id.toString() || a.applicationId === id);
    if (!app) return null;
    app.status = newStatus;
    if (reviewerScore !== undefined && reviewerScore !== null && reviewerScore !== '') {
      app.reviewerScore = Number(reviewerScore);
    }
    if (reviewerNote && reviewerNote.trim()) {
      if (!app.reviewerNotes) app.reviewerNotes = [];
      app.reviewerNotes.push({
        author: 'Bitwise Admissions Board',
        note: reviewerNote.trim(),
        timestamp: new Date()
      });
    }
    if (statusMap[newStatus]) {
      if (!app.timeline) app.timeline = [];
      app.timeline.push({
        title: statusMap[newStatus].title,
        description: statusMap[newStatus].desc,
        date: new Date(),
        status: newStatus
      });
    }
    app.updatedAt = new Date();
    return app;
  },

  // --- STATS HELPER FOR ADMIN COMMAND CENTER ---
  async getAdmissionsStats() {
    const apps = await this.getAllApplications();
    const totalApplications = apps.length;
    const acceptedCount = apps.filter(a => a.status === 'accepted').length;
    const underReviewCount = apps.filter(a => ['submitted', 'under_review', 'tech_assessment', 'interview_scheduled'].includes(a.status)).length;
    const acceptanceRate = totalApplications > 0 ? ((acceptedCount / totalApplications) * 100).toFixed(1) : '4.8';

    const trackBreakdown = {
      'btech-ai-cs': apps.filter(a => a.track === 'btech-ai-cs').length,
      'btech-autonomous-systems': apps.filter(a => a.track === 'btech-autonomous-systems').length,
      'founder-fellowship': apps.filter(a => a.track === 'founder-fellowship').length
    };

    const projects = await this.getAllProjects();
    const mentors = await this.getAllMentors();
    const hackathons = await this.getAllHackathons();

    return {
      totalApplications,
      acceptedCount,
      underReviewCount,
      acceptanceRate,
      trackBreakdown,
      totalProjects: projects.length,
      totalMentors: mentors.length,
      totalHackathons: hackathons.length
    };
  }
};

module.exports = dataService;
