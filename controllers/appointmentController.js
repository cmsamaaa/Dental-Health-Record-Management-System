const _ = require('lodash');
const moment = require('moment');
const request = require('request');
const async_request = require('async-request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const Appointment = require("../entities/appointment");
const Participant = require("../entities/participant");
const Staff = require('../entities/staff');
const ClinicTreatment = require("../entities/clinicTreatment");
const Treatment = require("../entities/treatment");
const oralRecord = require("../entities/oralRecord");
const Queue = require('../entities/queue');
const Bill = require('../entities/bill');
const Inventory = require('../entities/inventory');
const UsedMaterial = require('../entities/usedMaterial');

exports.createAppointment = async (req, res, next) => {
    const path = req.session.userRole === 'Patient' ? '/appointment/upcoming' : '/appointment/view-all';

    const appointment = new Appointment({
        startDateTime: req.body.startDateTime,
        staffId: req.body.staffId,
        patientId: req.body.patientId
    });

    const isDentistAvailable = await appointment.getDentistTimeslot();
    const isPatientAvailable = await appointment.getPatientTimeslot();

    if (isDentistAvailable)
        res.redirect(parse_uri.parse(req, `/${req.body.userType}/appointment/create?booked=dentist&clinicId=${req.body.clinicId}&staffId=${req.body.staffId}&patientId=${req.body.patientId}&startDateTime=${req.body.startDateTime}`));
    else if (isPatientAvailable)
        res.redirect(parse_uri.parse(req, `/${req.body.userType}/appointment/create?booked=patient&clinicId=${req.body.clinicId}&staffId=${req.body.staffId}&patientId=${req.body.patientId}&startDateTime=${req.body.startDateTime}`));
    else {
        // api endpoint uri
        const uri = parse_uri.parse(req, '/api/appointment/create');
        request.post({
            url: uri,
            form: req.body
        }, (err, response, body) => {
            if (response.statusCode === HTTP_STATUS.CREATED)
                res.redirect(parse_uri.parse(req, '/' + req.body.userType + path + '?action=create&id=' + JSON.parse(body).apptId));
            else
                res.redirect(parse_uri.parse(req, '/' + req.body.userType + '/appointment/create?error=true'));
        });
    }
};

exports.editAppointment = async (req, res, next) => {
    const path = req.session.userRole === 'Patient' ? '/appointment/upcoming' : '/appointment/view-all';

    const appointment = new Appointment({
        startDateTime: req.body.startDateTime,
        staffId: req.body.staffId,
        patientId: req.body.patientId
    });

    const isDentistAvailable = await appointment.getDentistTimeslot();
    const isPatientAvailable = await appointment.getPatientTimeslot();

    if (isDentistAvailable) {
        if (isDentistAvailable.apptId == req.body.apptId)
            res.redirect(parse_uri.parse(req, '/' + req.body.for + path + '?action=edit&id=' + req.body.apptId));
        else
            res.redirect(parse_uri.parse(req, `/${req.body.for}/appointment/edit/${req.body.apptId}?booked=dentist&clinicId=${req.body.clinicId}&staffId=${req.body.staffId}&patientId=${req.body.patientId}&startDateTime=${req.body.startDateTime}`));
    }
    else if (isPatientAvailable) {
        if (isPatientAvailable.apptId == req.body.apptId)
            res.redirect(parse_uri.parse(req, '/' + req.body.for + path + '?action=edit&id=' + req.body.apptId));
        else
            res.redirect(parse_uri.parse(req, `/${req.body.for}/appointment/edit/${req.body.apptId}?booked=patient&clinicId=${req.body.clinicId}&staffId=${req.body.staffId}&patientId=${req.body.patientId}&startDateTime=${req.body.startDateTime}`));
    }
    else {
        const appointmentResponse = await async_request(parse_uri.parse(req, '/api/appointment/edit'), {
            method: 'POST',
            data: req.body
        });
        if (appointmentResponse.statusCode === HTTP_STATUS.OK)
            res.redirect(parse_uri.parse(req, '/' + req.body.for + path + '?action=edit&id=' + req.body.apptId));
        else
            res.redirect(parse_uri.parse(req, `/${req.body.for}/appointment/edit/${req.body.apptId}?error=true`));
    }
};

exports.endInSessionAppointment = async (req, res, next) => {
    const status = 'Payment';

    const treatment = new Treatment({ apptId: req.body.apptId });

    // Check if all treatments are marked as done
    const isInProgress = await treatment.checkInProgressTreatments();

    const usedMaterial = new UsedMaterial({ apptId: req.body.apptId });
    const usedMaterialData = await usedMaterial.getUsedMaterials();

    if (!isInProgress) {
        let quantityPass = true;
        if (!_.isEmpty(usedMaterialData)) {
            const hashMap = new Map();

            for (let i = 0; i < usedMaterialData.length; i++) {
                if (hashMap.has(usedMaterialData[i].inventoryId)) {
                    const currQty = hashMap.get(usedMaterialData[i].inventoryId);
                    hashMap.set(usedMaterialData[i].inventoryId, currQty + usedMaterialData[i].materialQty);
                }
                else
                    hashMap.set(usedMaterialData[i].inventoryId, usedMaterialData[i].materialQty);
            }

            const mapIterator1 = hashMap.entries();
            while (pair = mapIterator1.next().value) {
                const inventory = new Inventory({
                    inventoryId: pair[0],
                });
                const result = await inventory.getInventory();

                if (result.quantity < pair[1])
                    quantityPass = false;
            }

            if (quantityPass) {
                const mapIterator2 = hashMap.entries();
                while (pair = mapIterator2.next().value) {
                    const inventory = new Inventory({
                        inventoryId: pair[0],
                        quantity: pair[1]
                    });
                    const result = await inventory.updateInventoryQty();
                }
            }
        }

        if (quantityPass) {
            // Get treatment price sum
            const treatmentData = await treatment.getSumTreatmentPrice();

            if (!_.isEmpty(treatmentData)) {
                // Create bill record
                const bill = new Bill({
                    billSubtotal: treatmentData.totalPrice,
                    billTax: treatmentData.totalPrice * 0.08,
                    billTotal: treatmentData.totalPrice * 1.08,
                    apptId: req.body.apptId
                });
                const billData = await bill.createBill();

                if (!_.isEmpty(billData)) {
                    // Update queue record to payment phase
                    const queue = new Queue({
                        apptId: req.body.apptId,
                        queueStatus: status
                    });
                    const queueData = await queue.endInSessionQueue();

                    if (queueData) {
                        // Update appointment record to payment phase
                        const appointment = new Appointment({
                            apptId: req.body.apptId,
                            status: status
                        });
                        const appointmentData = await appointment.updateAppointmentStatus();

                        if (appointmentData)
                            res.redirect(parse_uri.parse(req, '/dentist/queue/view-all?apptStatus=payment'));
                        else
                            res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?entity=appointment&error=true'));
                    }
                    else
                        res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?entity=queue&error=true'));
                }
                else
                    res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?entity=bill&error=true'));
            }
            else
                res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?entity=treatment&error=true'));
        }
        else
            res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?inventory=error'));
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session?treatment=in-progress'));
};

exports.suspendAppointment = async (req, res, next) => {
    const path = req.session.userRole === 'Patient' ? '/appointment/upcoming' : '/appointment/view-all';

    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/suspend');
    request.post({
        url: uri,
        form: req.body
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK)
            res.redirect(parse_uri.parse(req, '/' + req.body.for + path + '?action=cancel&id=' + req.body.apptId));
        else
            res.redirect(parse_uri.parse(req, '/' + req.body.for + path + '?error=true'));
    });
};

exports.viewCreateAppointment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    if (user === 'patient') {
        let nearbyClinicData = await async_request(parse_uri.parse(req, '/api/clinic/get/all/' + req.session.userInfo.postal + '?type=district'));
        if (!nearbyClinicData.body)
            nearbyClinicData = await async_request(parse_uri.parse(req, '/api/clinic/get/all/' + req.session.userInfo.postal + '?type=region'));

        request.get({
            url: parse_uri.parse(req, '/api/patient/get/' + req.session.userInfo.userId),
        }, (err, response, body) => {
            if (response.statusCode === HTTP_STATUS.OK) {
                const userData = JSON.parse(response.body);

                if (!req.query.clinicId) {
                    request.get({
                        url: parse_uri.parse(req, '/api/clinic/get/all')
                    }, (err, response, body) => {
                        if (response.statusCode === HTTP_STATUS.OK) {
                            res.status(HTTP_STATUS.OK).render('form/appointment', {
                                pageTitle: 'Appointment',
                                path: '/' + user + '/appointment/create',
                                query: req.query,
                                dentistData: [],
                                clinicData: JSON.parse(response.body),
                                nearbyClinicData: nearbyClinicData.body ? JSON.parse(nearbyClinicData.body) : []
                            });
                        }
                        else {
                            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                                pageTitle: 'Appointment',
                                path: '/' + user + '/appointment/create',
                                query: req.query
                            });
                        }
                    });
                }
                else {
                    request.get({
                        url: parse_uri.parse(req, '/api/clinic/get/dentist/' + req.query.clinicId)
                    }, (err, response, body) => {
                        if (response.statusCode === HTTP_STATUS.OK) {
                            res.status(HTTP_STATUS.OK).render('form/appointment', {
                                pageTitle: 'Appointment',
                                path: '/' + user + '/appointment/create',
                                query: req.query,
                                dentistData: JSON.parse(response.body),
                                userData: userData
                            });
                        }
                        else {
                            res.redirect(parse_uri.parse(req, '/' + user + '/appointment/create?apptCreate=false&listClinics=error'));
                        }
                    });
                }
            }
            else {
                res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                    pageTitle: 'Appointment',
                    path: '/' + user + '/appointment/create',
                    query: req.query
                });
            }
        });
    }
    else {
        // api endpoint uri
        const uri = parse_uri.parse(req, '/api/patient/get/all');
        request.get({
            url: uri,
        }, (err, response, body) => {
            if (response.statusCode === HTTP_STATUS.OK) {
                const userData = JSON.parse(response.body);

                request.get({
                    url: parse_uri.parse(req, '/api/clinic/get/dentist/' + req.session.userInfo.clinicId)
                }, (err, response, body) => {
                    if (response.statusCode === HTTP_STATUS.OK) {
                        res.status(HTTP_STATUS.OK).render('form/appointment', {
                            pageTitle: 'Appointment',
                            path: '/' + user + '/appointment/create',
                            query: req.query,
                            dentistData: JSON.parse(response.body),
                            userData: userData
                        });
                    }
                    else {
                        res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                            pageTitle: 'Appointment',
                            path: '/' + user + '/appointment/create',
                            query: req.query
                        });
                    }
                });
            }
            else {
                res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                    pageTitle: 'Appointment',
                    path: '/' + user + '/appointment/create',
                    query: req.query
                });
            }
        });
    }
};

exports.viewEditAppointment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/get/' + req.params.apptId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            let userData = JSON.parse(response.body);

            request.get({
                url: parse_uri.parse(req, '/api/dentist/get/' + userData.staffId)
            }, (err, response, body) => {
                if (response.statusCode === HTTP_STATUS.OK) {
                    res.status(HTTP_STATUS.OK).render('form/appointment', {
                        pageTitle: 'Appointment',
                        path: '/' + user + '/appointment/edit',
                        query: req.query,
                        dentistData: JSON.parse(response.body),
                        oralrecordData: userData,
                        userData: userData
                    });
                }
                else {
                    res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                        pageTitle: 'Appointment',
                        path: '/' + user + '/appointment/edit',
                        query: req.query
                    });
                }
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Appointment',
                path: '/' + user + '/appointment/edit',
                query: req.query
            });
        }
    });
};

exports.viewAppointments = async (req, res, next) => {
    const user = req.url.split('/')[1];
    const filter = req.query.filter;

    const pageTitle = 'Appointment';
    const path = '/' + user + '/appointment/view-all';

    if (user === 'admin') {
        const appointment = new Appointment({
            clinicId: req.session.userInfo.clinicId
        });
        let results;

        if (filter === 'all')
            results = await appointment.getAllClinicAppointmentsByClinic();
        else if (filter === 'upcoming')
            results = await appointment.getAllUpcomingAppointmentsByClinic();
        else if (filter === 'past')
            results = await appointment.getAllPastAppointmentsByClinic();
        else
            results = await appointment.getAllClinicAppointmentsByClinic();

        if (!_.isEmpty(results)) {
            let apptData = results;

            apptData = _.map(apptData, (appt) => {
                appt.startDateTime = moment(new Date(appt.startDateTime)).format('YYYY-MM-DD HH:mm');
                appt.endDateTime = moment(new Date(appt.endDateTime)).format('YYYY-MM-DD HH:mm');
                return appt;
            });

            res.status(HTTP_STATUS.OK).render('table/appointments', {
                pageTitle: pageTitle,
                path: path,
                query: req.query,
                appointmentData: apptData
            });
        }
        else
            res.status(HTTP_STATUS.NOT_FOUND).render('table/appointments', {
                pageTitle: pageTitle,
                path: path,
                query: req.query,
                appointmentData: []
            });
    }

    if (user === 'dentist') {
        const appointment = new Appointment({
            staffId: req.session.userInfo.staffId
        });
        let results;

        if (filter === 'all')
            results = await appointment.getAllClinicAppointments();
        else if (filter === 'upcoming')
            results = await appointment.getAllUpcomingAppointments();
        else if (filter === 'past')
            results = await appointment.getAllPastAppointments();
        else
            results = await appointment.getAllClinicAppointments();

        if (!_.isEmpty(results)) {
            let apptData = results;

            apptData = _.map(apptData, (appt) => {
                appt.startDateTime = moment(new Date(appt.startDateTime)).format('YYYY-MM-DD HH:mm');
                appt.endDateTime = moment(new Date(appt.endDateTime)).format('YYYY-MM-DD HH:mm');
                return appt;
            });

            res.status(HTTP_STATUS.OK).render('table/appointments', {
                pageTitle: pageTitle,
                path: path,
                query: req.query,
                oralrecordData: apptData,
                appointmentData: apptData
            });
        }
        else
            res.status(HTTP_STATUS.NOT_FOUND).render('table/appointments', {
                pageTitle: pageTitle,
                path: path,
                query: req.query,
                appointmentData: []
            });
    }

    if (user === 'patient') {
        let path = '/' + user + '/appointment/upcoming';

        // api endpoint uri
        const uri = parse_uri.parse(req, '/api/appointment/get/all/upcoming/' + req.session.userInfo.userId);

        request.get({
            url: uri,
        }, (err, response, body) => {
            let apptData = JSON.parse(response.body);

            if (!_.isEmpty(apptData)) {
                apptData = _.map(apptData, (appt) => {
                    appt.startDateTime = moment(new Date(appt.startDateTime)).format('YYYY-MM-DD HH:mm');
                    appt.endDateTime = moment(new Date(appt.endDateTime)).format('YYYY-MM-DD HH:mm');
                    return appt;
                });

                res.status(HTTP_STATUS.OK).render('table/appointments', {
                    pageTitle: pageTitle,
                    path: path,
                    query: req.query,
                    appointmentData: apptData
                });
            }
            else
                res.status(HTTP_STATUS.NOT_FOUND).render('table/appointments', {
                    pageTitle: pageTitle,
                    path: path,
                    query: req.query,
                    appointmentData: []
                });
        });
    }
};

exports.viewPastAppointments = async (req, res, next) => {
    const user = req.url.split('/')[1];
    const pageTitle = 'Appointment';
    const path = '/' + user + '/appointment/past';

    const appointment = new Appointment({
        userId: req.session.userInfo.userId
    });
    const results = await appointment.getAllUserPastAppointments();

    if (!_.isEmpty(results)) {
        let apptData = results;

        apptData = _.map(apptData, (appt) => {
            appt.startDateTime = moment(new Date(appt.startDateTime)).format('YYYY-MM-DD HH:mm');
            appt.endDateTime = moment(new Date(appt.endDateTime)).format('YYYY-MM-DD HH:mm');
            return appt;
        });

        res.status(HTTP_STATUS.OK).render('table/appointments', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            appointmentData: apptData
        });
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).render('table/appointments', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            appointmentData: []
        });
};

exports.viewAppointment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const title = 'Appointment';
    const path = '/' + user + '/appointment/view';

    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/get/' + req.params.apptId);

    const oralrecord = new oralRecord({ apptId: req.params.apptId });
    const oralrecordData = await oralrecord.getApptOralRecord();

    // Get list of participants
    const participant = new Participant({ apptId: req.params.apptId });
    const participantData = await participant.getParticipants();

    // Get current appointment's treatment data
    const treatment = new Treatment({ apptId: req.params.apptId });
    const treatmentData = await treatment.getAllTreatments();

    // Get used materials data
    const usedMaterial = new UsedMaterial({ apptId: req.params.apptId });
    const usedMaterialData = await usedMaterial.getUsedMaterials();

    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            let userData = JSON.parse(response.body);

            request.get({
                url: parse_uri.parse(req, '/api/dentist/get/' + userData.staffId)
            }, (err, response, body) => {
                if (response.statusCode === HTTP_STATUS.OK) {

                    res.status(HTTP_STATUS.OK).render('detail/appointment', {
                        pageTitle: title,
                        path: path,
                        query: req.query,
                        dentistData: JSON.parse(response.body),
                        oralrecordData: oralrecordData,
                        userData: userData,
                        userRole: user,
                        participantData: participantData,
                        treatmentData: treatmentData,
                        usedMaterialData: usedMaterialData
                    });
                }
                else {
                    res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                        pageTitle: title,
                        path: path,
                        query: req.query
                    });
                }
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: title,
                path: path,
                query: req.query
            });
        }
    });
};

exports.viewInSessionAppointment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const title = 'Appointment';
    const path = '/' + user + '/appointment/in-session';

    // Get appointment in-session by staffId
    let appointment = new Appointment({ staffId: req.session.userInfo.staffId });
    const appointmentData = await appointment.getDentistCurrentAppointment();

    if (!_.isEmpty(appointmentData)) {
        // Get dentist info
        let dentistResponse = await async_request(parse_uri.parse(req, '/api/dentist/get/' + appointmentData.staffId));

        // Get dentist info if user is `Dental Assistant`
        if (req.session.userRole === 'Dental Assistant') {
            appointment = new Appointment({ apptId: appointmentData.apptId });
            const tempData = await appointment.getAppointment();

            dentistResponse = await async_request(parse_uri.parse(req, '/api/dentist/get/' + tempData.staffId));
        }

        if (dentistResponse.statusCode === HTTP_STATUS.OK) {
            // Get clinic's treatment data
            const clinicTreatment = new ClinicTreatment({ clinicId: appointmentData.clinicId });
            const clinicTreatmentData = await clinicTreatment.getAllActive();

            // Get list of participants
            const participant = new Participant({ apptId: appointmentData.apptId });
            const participantData = await participant.getParticipants();

            // Get list of dental assistant
            const staff = new Staff({ clinicId: appointmentData.clinicId });
            const staffData = await staff.getAllAssistants();

            // Get current appointment's treatment data
            const treatment = new Treatment({ apptId: appointmentData.apptId });
            const treatmentData = await treatment.getAllTreatments();

            // Get used materials data
            const usedMaterial = new UsedMaterial({ apptId: appointmentData.apptId });
            const usedMaterialData = await usedMaterial.getUsedMaterials();

            // Get inventory list
            const inventory = new Inventory({ clinicId: req.session.userInfo.clinicId });
            const inventoryData = await inventory.getAllInventories();

            const oralrecord = new oralRecord({ apptId: appointmentData.apptId });
            const oralrecordData = await oralrecord.getApptOralRecord();

            res.status(HTTP_STATUS.OK).render('detail/appointment_in_session', {
                pageTitle: title,
                path: path,
                query: req.query,
                appointmentData: appointmentData,
                userData: appointmentData,
                dentistData: JSON.parse(dentistResponse.body),
                clinicTreatmentData: !_.isEmpty(clinicTreatmentData) ? clinicTreatmentData : [],
                participantData: !_.isEmpty(participantData) ? participantData : [],
                staffData: !_.isEmpty(staffData) ? staffData : [],
                treatmentData: !_.isEmpty(treatmentData) ? treatmentData : [],
                usedMaterialData: usedMaterialData,
                inventoryData: inventoryData,
                oralrecordData: oralrecordData
            });
        }
        else
            res.redirect(parse_uri.parse(req, '/' + user + '/appointment/view-all'));
    }
    else
        res.redirect(parse_uri.parse(req, '/' + user + '/appointment/view-all'));
};