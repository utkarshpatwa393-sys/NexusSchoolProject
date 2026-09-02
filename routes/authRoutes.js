const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.post('/quick-demo', authController.postQuickDemo);
router.post('/logout', authController.postLogout);
router.get('/logout', authController.postLogout);

module.exports = router;
