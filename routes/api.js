const express = require('express');

const patientAPIController = require('../controllers/patientAPIController');
const staffAPIController = require('../controllers/staffAPIController');
const appointmentAPIController = require('../controllers/appointmentAPIController');
const clinicAPIController = require('../controllers/clinicAPIController');
const queueAPIController = require('../controllers/queueAPIController');

const router = express.Router();

router.get('/clinic/get/all', clinicAPIController.getAll);
router.get('/clinic/get/all/:postal', clinicAPIController.getByPostal);
router.get('/clinic/get/dentist/:clinicId', clinicAPIController.getAllDentists);
router.get('/clinic/get/:clinicId', clinicAPIController.get);

router.get('/patient/get/all', patientAPIController.getAllPatients);
router.get('/patient/get/:userId', patientAPIController.getPatient);

router.get('/dentist/get/:staffId', staffAPIController.getDentist);

router.post('/appointment/create', appointmentAPIController.createAppointment);
router.get('/appointment/get/all/upcoming/:userId', appointmentAPIController.getAllUserUpcomingAppointments);
router.get('/appointment/get/all/upcoming/nric/:nric', appointmentAPIController.getAllUserUpcomingAppointments_NRIC);
router.get('/appointment/get/:apptId', appointmentAPIController.getAppointment);
router.post('/appointment/edit', appointmentAPIController.editAppointment);
router.post('/appointment/suspend', appointmentAPIController.suspendAppointment);

router.get('/queue/get/:patientId', queueAPIController.getPatientQueue);
router.get('/queue/get/count/:clinicId', queueAPIController.getQueueCount);

module.exports = router;