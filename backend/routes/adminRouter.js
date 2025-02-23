const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');
const adminValidator = require('../middlewares/adminValidator.js')
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware.js')

//center
router.post('/centers', verifyToken, isAdmin, adminValidator.addCenter, adminController.createCenter);
router.get('/centers', verifyToken, isAdmin, adminController.getAllCenters)
router.get('/centers/:id', verifyToken, isAdmin, adminController.getCenterById);
router.put('/centers/:id', verifyToken, isAdmin, adminController.updateCenter);
router.delete('/centers/:id', verifyToken, isAdmin, adminController.deleteCenter)

//assign-remove doctor from center
router.post('/assign-doctor', verifyToken, isAdmin, adminController.assignDoctorToCenter);
router.post('/remove-doctor', verifyToken, isAdmin, adminController.removeDoctorFromCenter);

//account
router.post('/create-account', verifyToken, isAdmin, adminController.createAccount);
router.get('/accounts', verifyToken, isAdmin, adminController.getAllAccounts);
router.get('/accounts/:id', verifyToken, isAdmin, adminController.getAccountById);
router.put('/accounts/:id', verifyToken, isAdmin, adminController.updateAccount);
router.delete('/accounts/:id', verifyToken, isAdmin, adminController.deleteAccount);

//appointment
router.put('/appointments/:id/approve', verifyToken, isAdmin, adminController.approveAppointment);
router.put('/appointments/:id/cancel', verifyToken, isAdmin, adminController.rejectAppointment);

module.exports = router;