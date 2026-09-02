const dataService = require('../services/dataService');

module.exports = {
  // GET /auth/login
  getLogin(req, res) {
    if (req.session && req.session.user) {
      return res.redirect('/dashboard');
    }
    const redirectUrl = req.query.redirect || '/dashboard';
    res.render('pages/auth/login', {
      title: 'Neural Login | Nexus Institute of Technology',
      redirectUrl
    });
  },

  // POST /auth/login
  async postLogin(req, res) {
    try {
      const { email, password, redirectUrl } = req.body;

      if (!email || !password) {
        req.flash('error', 'Please provide both neural identification email and passcode.');
        return res.redirect(`/auth/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`);
      }

      const user = await dataService.findUserByEmail(email);
      if (!user) {
        req.flash('error', 'Authentication failed: Identification signature not found in registry.');
        return res.redirect(`/auth/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`);
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        req.flash('error', 'Authentication failed: Invalid encryption passcode.');
        return res.redirect(`/auth/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`);
      }

      // Establish session
      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        avatar: user.avatar,
        bio: user.bio,
        track: user.track,
        computeHours: user.computeHours,
        badgeTier: user.badgeTier
      };

      req.flash('success', `Access Granted. Welcome back to Nexus, ${user.name.split(' ')[0]}!`);
      const dest = redirectUrl && redirectUrl.startsWith('/') ? redirectUrl : (user.role === 'admin' ? '/admin' : '/dashboard');
      return res.redirect(dest);
    } catch (err) {
      console.error('Login error:', err);
      req.flash('error', 'Internal gateway error during authentication.');
      return res.redirect('/auth/login');
    }
  },

  // GET /auth/register
  getRegister(req, res) {
    if (req.session && req.session.user) {
      return res.redirect('/dashboard');
    }
    res.render('pages/auth/register', {
      title: 'Create Nexus Identity | Nexus Institute of Technology',
      track: req.query.track || 'btech-ai-cs'
    });
  },

  // POST /auth/register
  async postRegister(req, res) {
    try {
      const { name, email, password, confirmPassword, track, githubUsername } = req.body;

      if (!name || !email || !password) {
        req.flash('error', 'All core identity fields are mandatory.');
        return res.redirect('/auth/register');
      }

      if (password !== confirmPassword) {
        req.flash('error', 'Passcode mismatch. Please ensure both passwords are identical.');
        return res.redirect('/auth/register');
      }

      if (password.length < 6) {
        req.flash('error', 'Passcode encryption must be at least 6 characters.');
        return res.redirect('/auth/register');
      }

      const existingUser = await dataService.findUserByEmail(email);
      if (existingUser) {
        req.flash('error', 'An identity with this email is already registered in the Nexus network.');
        return res.redirect('/auth/login');
      }

      const newUser = await dataService.createUser({
        name,
        email,
        password,
        role: 'applicant',
        track: track || 'btech-ai-cs',
        githubUsername: githubUsername || '',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
      });

      req.session.user = {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        studentId: newUser.studentId,
        avatar: newUser.avatar,
        bio: newUser.bio,
        track: newUser.track,
        computeHours: newUser.computeHours,
        badgeTier: newUser.badgeTier
      };

      req.flash('success', `Nexus Identity Provisioned! Welcome aboard, ${newUser.name}.`);
      return res.redirect('/apply');
    } catch (err) {
      console.error('Registration error:', err);
      req.flash('error', 'Gateway error during account creation. Please retry.');
      return res.redirect('/auth/register');
    }
  },

  // POST /auth/quick-demo
  async postQuickDemo(req, res) {
    const { role } = req.body;
    let targetEmail = 'alex.chen@nexus.edu'; // default student

    if (role === 'admin') {
      targetEmail = 'admin@nexus.edu';
    } else if (role === 'applicant') {
      targetEmail = 'priya.patel@gmail.com';
    }

    const user = await dataService.findUserByEmail(targetEmail);
    if (user) {
      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        avatar: user.avatar,
        bio: user.bio,
        track: user.track,
        computeHours: user.computeHours,
        badgeTier: user.badgeTier
      };
      req.flash('success', `Quick Demo Session Active as: ${user.name} (${user.role.toUpperCase()})`);
      return res.redirect(user.role === 'admin' ? '/admin' : '/dashboard');
    }

    req.flash('error', 'Demo user could not be initialized.');
    return res.redirect('/auth/login');
  },

  // POST /auth/logout
  postLogout(req, res) {
    req.session.destroy(err => {
      if (err) console.error('Session destroy error:', err);
      res.redirect('/auth/login?logged_out=true');
    });
  }
};
