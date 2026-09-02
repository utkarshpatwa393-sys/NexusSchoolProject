module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }
    req.flash('error', 'Authentication required. Accessing the Nexus Terminal requires an active session.');
    return res.redirect(`/auth/login?redirect=${encodeURIComponent(req.originalUrl)}`);
  },

  ensureGuest: (req, res, next) => {
    if (!req.session || !req.session.user) {
      return next();
    }
    return res.redirect('/dashboard');
  },

  ensureAdmin: (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    req.flash('error', 'Restricted Area: Admissions Command Center requires Administrator clearance level.');
    return res.redirect('/dashboard');
  },

  ensureStudentOrAdmin: (req, res, next) => {
    if (req.session && req.session.user && ['student', 'admin'].includes(req.session.user.role)) {
      return next();
    }
    req.flash('info', 'This feature is unlocked for matriculated Nexus Students & Fellows.');
    return res.redirect('/dashboard');
  }
};
