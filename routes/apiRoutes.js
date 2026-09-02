const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.post('/terminal', apiController.postTerminalCommand);
router.post('/ai-assistant', apiController.postAiAssistant);

module.exports = router;
