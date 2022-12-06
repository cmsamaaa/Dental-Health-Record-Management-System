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
router.get('/logout', userController.logout);

// Protected routes
router.post('/admin/clinic/add-information', routeAuth.isAuth, routeAuth.isAdmin, clinicInfoController.addClinicInfo);

router.post('/admin/user/suspend', routeAuth.isAuth, routeAuth.isAdmin, userController.suspend);
router.post('/admin/user/reactivate', routeAuth.isAuth, routeAuth.isAdmin, userController.reactivate);

router.post('/admin/staff/create', routeAuth.isAuth, routeAuth.isAdmin, staffController.register);
router.post('/admin/staff/edit', routeAuth.isAuth, routeAuth.isAdmin, staffController.edit);

router.post('/admin/patient/create', routeAuth.isAuth, routeAuth.isAdmin, patientController.register);
router.post('/admin/patient/edit', routeAuth.isAuth, routeAuth.isAdmin, patientController.edit);

router.post('/admin/appointment/create', routeAuth.isAuth, routeAuth.isAdmin, appointmentController.createAppointment);
router.post('/admin/appointment/edit', routeAuth.isAuth, routeAuth.isAdmin, appointmentController.editAppointment);
router.post('/admin/appointment/suspend', routeAuth.isAuth, routeAuth.isAdmin, appointmentController.suspendAppointment);

router.post('/patient/appointment/create', routeAuth.isAuth, routeAuth.isPatient, appointmentController.createAppointment);
router.post('/patient/appointment/edit', routeAuth.isAuth, routeAuth.isPatient, appointmentController.editAppointment);
router.post('/patient/appointment/suspend', routeAuth.isAuth, routeAuth.isPatient, appointmentController.suspendAppointment);

module.exports = router;