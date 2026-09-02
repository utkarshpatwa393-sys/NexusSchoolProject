const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathonController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/', hackathonController.getHackathons);
router.get('/:slug', hackathonController.getHackathonDetail);
router.post('/:id/register', ensureAuthenticated, hackathonController.postRegister);

module.exports = router;
