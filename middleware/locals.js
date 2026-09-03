module.exports = (req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  res.locals.flashInfo = req.flash('info');
  res.locals.siteName = 'Bitwise School of Technology';
  res.locals.admissionsOpen = true;
  res.locals.batchYear = '2026-2030';
  next();
};
