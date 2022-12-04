const express = require('express');

const userAPIController = require('../controllers/userAPIController');
const patientAPIController = require('../controllers/patientAPIController');
const appointmentAPIController = require('../controllers/appointmentAPIController');
const clinicInfoAPIController = require('../controllers/clinicInfoAPIController');

const router = express.Router();

router.post('/info/create', clinicInfoAPIController.add);
router.get('/info/get/all', clinicInfoAPIController.getAll);
router.get('/info/get/:key', clinicInfoAPIController.get);

router.post('/user/create', userAPIController.createUser);
router.post('/user/login', userAPIController.authenticateUser);
router.get('/user/get/nric/all', userAPIController.getAllNRIC);

router.post('/patient/create', patientAPIController.registerPatient);
router.get('/patient/get/all', patientAPIController.getAllPatients);
router.get('/patient/get/:userId', patientAPIController.getPatient);


router.post('/appointment/create', appointmentAPIController.createAppointment);
router.get('/appointment/get/all', appointmentAPIController.getAllAppointments);
router.get('/appointment/get/all/:userId', appointmentAPIController.getAllUserAppointments);

module.exports = router;