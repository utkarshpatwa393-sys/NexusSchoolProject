const dataService = require('../services/dataService');

module.exports = {
  // GET /apply - Multi-step application wizard
  async getApply(req, res) {
    try {
      const existingApp = await dataService.getApplicationByUserId(req.session.user.id);

      if (existingApp && existingApp.status !== 'draft') {
        req.flash('info', 'You have already submitted an active application dossier. You can track your status live.');
        return res.redirect('/application-status');
      }

      res.render('pages/apply', {
        title: 'Admissions Application Dossier | Bitwise School of Technology',
        existingApp: existingApp || null,
        user: req.session.user
      });
    } catch (err) {
      console.error('Error loading apply page:', err);
      res.render('pages/apply', {
        title: 'Apply | Bitwise School of Technology',
        existingApp: null,
        user: req.session.user
      });
    }
  },

  // POST /apply - Submit Application
  async postApply(req, res) {
    try {
      const userId = req.session.user.id;
      const {
        track,
        fullName,
        email,
        phone,
        city,
        country,
        linkedinUrl,
        githubUrl,
        portfolioUrl,
        highestEducation,
        schoolOrCollege,
        graduationYear,
        gpaOrPercentage,
        standardizedTestScore,
        experienceLevel,
        primaryLanguages,
        bestProjectUrl,
        bestProjectDescription,
        hackathonsAttended,
        visionEssay,
        whyBitwise,
        whyNexus,
        founderAmbition,
        fundingPreference
      } = req.body;

      const whySchool = whyBitwise || whyNexus;

      if (!track || !fullName || !email || !highestEducation || !visionEssay || !whySchool) {
        req.flash('error', 'Please fill in all mandatory fields across the application wizard.');
        return res.redirect('/apply');
      }

      const languages = Array.isArray(primaryLanguages)
        ? primaryLanguages
        : (primaryLanguages ? primaryLanguages.split(',').map(l => l.trim()) : ['Python', 'TypeScript']);

      const appData = {
        user: userId,
        track,
        personalDetails: {
          fullName,
          email,
          phone: phone || '',
          city: city || 'Bangalore',
          country: country || 'India',
          linkedinUrl: linkedinUrl || '',
          githubUrl: githubUrl || '',
          portfolioUrl: portfolioUrl || ''
        },
        academicBackground: {
          highestEducation,
          schoolOrCollege: schoolOrCollege || 'High School / University',
          graduationYear: Number(graduationYear) || 2026,
          gpaOrPercentage: gpaOrPercentage || '',
          standardizedTestScore: standardizedTestScore || ''
        },
        technicalExperience: {
          experienceLevel: experienceLevel || 'intermediate',
          primaryLanguages: languages,
          bestProjectUrl: bestProjectUrl || '',
          bestProjectDescription: bestProjectDescription || '',
          hackathonsAttended: Number(hackathonsAttended) || 0
        },
        essayChallenge: {
          visionEssay,
          whyBitwise: whySchool,
          whyNexus: whySchool,
          founderAmbition: founderAmbition || ''
        },
        fundingPreference: fundingPreference || 'income_share_agreement'
      };

      const application = await dataService.createApplication(appData);

      // Update user track & bio
      await dataService.updateUser(userId, {
        track,
        githubUsername: githubUrl ? githubUrl.split('/').filter(Boolean).pop() : req.session.user.githubUsername
      });

      req.session.user.track = track;

      req.flash('success', `Application ${application.applicationId} successfully submitted to the Admissions Vault!`);
      return res.redirect('/application-status');
    } catch (err) {
      console.error('Error submitting application:', err);
      req.flash('error', 'Encountered an error while saving your application dossier.');
      return res.redirect('/apply');
    }
  },

  // GET /application-status - Real-time Status Tracker
  async getApplicationStatus(req, res) {
    try {
      const application = await dataService.getApplicationByUserId(req.session.user.id);

      if (!application) {
        req.flash('info', 'No active application dossier found. Please complete the application process.');
        return res.redirect('/apply');
      }

      res.render('pages/application-status', {
        title: `Application Status [${application.applicationId}] | Bitwise School of Technology`,
        application
      });
    } catch (err) {
      console.error('Error getting application status:', err);
      req.flash('error', 'Unable to retrieve application records.');
      return res.redirect('/dashboard');
    }
  }
};
