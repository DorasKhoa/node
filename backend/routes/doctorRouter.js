const express = require('express');
const router = express.Router();
const {verifyToken, isDoctor} = require('../middlewares/authMiddleware');
const doctorController = require('../controllers/doctorController.js');

//appointment
router.get('/appointments', verifyToken, isDoctor, doctorController.getAppointments);
router.put('/appointments/:id/cancel', verifyToken, isDoctor, doctorController.cancelAppointment);
router.put('/appointments/:id/approve', verifyToken, isDoctor, doctorController.approveAppointment);

module.exports = router;