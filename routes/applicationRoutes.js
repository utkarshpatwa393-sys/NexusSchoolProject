const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/apply', ensureAuthenticated, applicationController.getApply);
router.post('/apply', ensureAuthenticated, applicationController.postApply);
router.get('/application-status', ensureAuthenticated, applicationController.getApplicationStatus);

module.exports = router;
