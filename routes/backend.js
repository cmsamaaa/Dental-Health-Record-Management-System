const express = require('express');

const userController = require('../controllers/userController');
const clinicInfoController = require('../controllers/clinicInfoController');
const patientController = require('../controllers/patientController');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

router.post('/admin/clinic/add-information', clinicInfoController.addClinicInfo);

router.post('/admin/patient/create', patientController.registerPatient);

router.post('/admin/appointment/create', appointmentController.createAppointment);
router.post('/patient/appointment/create', appointmentController.createAppointment);

module.exports = router;