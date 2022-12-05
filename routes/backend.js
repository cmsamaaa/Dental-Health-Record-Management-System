const express = require('express');

const userController = require('../controllers/userController');
const clinicInfoController = require('../controllers/clinicInfoController');
const patientController = require('../controllers/patientController');
const appointmentController = require('../controllers/appointmentController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// Non-protected routes
router.post('/login', patientController.login);
router.post('/register', userController.register);
router.get('/logout', userController.logout);

// Protected routes
router.post('/admin/clinic/add-information', isAuth, clinicInfoController.addClinicInfo);

router.post('/admin/patient/create', isAuth, patientController.register);

router.post('/admin/appointment/create', isAuth, appointmentController.createAppointment);
router.post('/patient/appointment/create', isAuth, appointmentController.createAppointment);

module.exports = router;