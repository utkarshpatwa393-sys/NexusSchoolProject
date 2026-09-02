const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/dashboard', ensureAuthenticated, dashboardController.getDashboard);
router.post('/dashboard/profile', ensureAuthenticated, dashboardController.postUpdateProfile);

module.exports = router;
