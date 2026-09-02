const express = require('express');
const router = express.Router();
const launchpadController = require('../controllers/launchpadController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', launchpadController.getLaunchpad);
router.get('/new', ensureAuthenticated, launchpadController.getNewProject);
router.post('/new', ensureAuthenticated, launchpadController.postNewProject);
router.post('/:id/upvote', launchpadController.postUpvote);

module.exports = router;
