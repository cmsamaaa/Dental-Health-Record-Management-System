const express = require('express');

const patientAPIController = require('../controllers/patientAPIController');
const appointmentAPIController = require('../controllers/appointmentAPIController');
const clinicInfoAPIController = require('../controllers/clinicInfoAPIController');

const router = express.Router();

router.get('/info/get/all', clinicInfoAPIController.getAll);
router.get('/info/get/:key', clinicInfoAPIController.get);

router.get('/patient/get/all', patientAPIController.getAllPatients);
router.get('/patient/get/:userId', patientAPIController.getPatient);

// staff retrieve all
// staff retrieve one

router.post('/appointment/create', appointmentAPIController.createAppointment);
router.get('/appointment/get/all', appointmentAPIController.getAllAppointments);
router.get('/appointment/get/all/:userId', appointmentAPIController.getAllUserAppointments);
// update appointment
// suspend (cancel) appointment

module.exports = router;