const express = require('express');

const userAPIController = require('../controllers/userAPIController');
const patientAPIController = require('../controllers/patientAPIController');
const appointmentAPIController = require('../controllers/appointmentAPIController');

const router = express.Router();

router.post('/user/create', userAPIController.createUser);
router.post('/user/login', userAPIController.authenticateUser);
router.get('/user/get/nric/all', userAPIController.getAllNRIC);

router.post('/patient/create', patientAPIController.registerPatient);
router.get('/patient/get/all', patientAPIController.getAllPatients);


router.post('/appointment/create', appointmentAPIController.createAppointment);
router.get('/patient/get/all', appointmentAPIController.getAllAppointments);

module.exports = router;