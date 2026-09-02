const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAdmin } = require('../middleware/auth');

router.use(ensureAdmin);

router.get('/', adminController.getDashboard);
router.get('/applications/:id', adminController.getApplicationDetail);
router.post('/applications/:id/status', adminController.postUpdateApplicationStatus);
router.get('/content', adminController.getManageContent);
router.post('/mentors/new', adminController.postCreateMentor);
router.post('/hackathons/new', adminController.postCreateHackathon);

module.exports = router;
