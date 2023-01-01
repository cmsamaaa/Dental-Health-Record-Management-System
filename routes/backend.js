const express = require('express');

const userController = require('../controllers/userController');
const clinicController = require('../controllers/clinicController');
const patientController = require('../controllers/patientController');
const staffController = require('../controllers/staffController');
const appointmentController = require('../controllers/appointmentController');
const inventoryController = require('../controllers/inventoryController');
const clinicTreatmentController = require('../controllers/clinicTreatmentController');
const routeAuth = require('../middleware/route-auth');

const router = express.Router();

// Non-protected routes
router.post('/login', routeAuth.setSession, patientController.login);
router.post('/staff/login', routeAuth.setSession, staffController.login);
router.get('/logout', routeAuth.setSession, userController.logout);

// Protected routes
router.post('/admin/clinic/edit/:clinicId', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicController.edit);
router.post('/admin/clinic/edit/:clinicId', routeAuth.isAuth, routeAuth.isAdmin, clinicController.edit);

router.post('/admin/user/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, userController.suspend);
router.post('/admin/user/reactivate', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, userController.reactivate);

router.post('/admin/staff/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, staffController.register);
router.post('/admin/staff/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, staffController.edit);

router.post('/admin/patient/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, patientController.register);
router.post('/admin/patient/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, patientController.edit);

router.post('/admin/appointment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.createAppointment);
router.post('/admin/appointment/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.editAppointment);
router.post('/admin/appointment/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, appointmentController.suspendAppointment);

router.post('/admin/treatment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.createTreatment);
router.post('/admin/treatment/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.editTreatment);
router.post('/admin/treatment/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.suspendTreatment);
router.post('/admin/treatment/reactivate', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, clinicTreatmentController.reactivateTreatment);

router.post('/admin/inventory/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, inventoryController.createInventory);
router.post('/admin/inventory/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, inventoryController.editInventory);
//router.post('/admin/inventory/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isAdmin, inventoryController.suspendInventory);

router.post('/patient/appointment/create', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.createAppointment);
router.post('/patient/appointment/edit', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.editAppointment);
router.post('/patient/appointment/suspend', routeAuth.setSession, routeAuth.isAuth, routeAuth.isPatient, appointmentController.suspendAppointment);

//router.post('/patient/profile/edit/:userId', routeAuth.isAuth, routeAuth.isPatient, patientController.editProfile);

module.exports = router;