const express = require('express');
const router = express.Router();

const publicRoutes = require('./publicRoutes');
const authRoutes = require('./authRoutes');
const applicationRoutes = require('./applicationRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const launchpadRoutes = require('./launchpadRoutes');
const hackathonRoutes = require('./hackathonRoutes');
const adminRoutes = require('./adminRoutes');
const apiRoutes = require('./apiRoutes');

router.use('/', publicRoutes);
router.use('/auth', authRoutes);
router.use('/', applicationRoutes);
router.use('/', dashboardRoutes);
router.use('/launchpad', launchpadRoutes);
router.use('/hackathons', hackathonRoutes);
router.use('/admin', adminRoutes);
router.use('/api', apiRoutes);

module.exports = router;
