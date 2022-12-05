const express = require('express');

const userController = require('../controllers/userController');
const clinicInfoController = require('../controllers/clinicInfoController');
const patientController = require('../controllers/patientController');
const staffController = require('../controllers/staffController');
const appointmentController = require('../controllers/appointmentController');
const routeAuth = require('../middleware/route-auth');

const router = express.Router();

// Non-protected routes
router.post('/login', patientController.login);
router.post('/staff/login', staffController.login);
// router.post('/register', userController.register);
router.get('/logout', userController.logout);

// Protected routes
router.post('/admin/clinic/add-information', routeAuth.isAuth, clinicInfoController.addClinicInfo);

router.post('/admin/patient/create', routeAuth.isAuth, patientController.register);

router.post('/admin/appointment/create', routeAuth.isAuth, appointmentController.createAppointment);
router.post('/patient/appointment/create', routeAuth.isAuth, appointmentController.createAppointment);

module.exports = router;