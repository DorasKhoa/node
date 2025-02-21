const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const userValidator = require('../middlewares/userValidator.js');
const { verifyToken, isUser } = require('../middlewares/authMiddleware.js')

//re-login account
router.post('/register', userValidator.registerValidator ,userController.register);
router.post('/login', userValidator.loginValidator ,userController.login);

//appointment
router.post('/appointments', verifyToken, isUser, userController.bookingAppointment);
router.get('/appointments', verifyToken, isUser, userController.getAppointment);

module.exports = router;
