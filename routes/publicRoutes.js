const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/', publicController.getHome);
router.get('/programs', publicController.getPrograms);
router.get('/curriculum', publicController.getCurriculum);
router.get('/mentors', publicController.getMentors);
router.get('/hackerhouse', publicController.getHackerhouse);
router.get('/tuition', publicController.getTuition);

module.exports = router;
