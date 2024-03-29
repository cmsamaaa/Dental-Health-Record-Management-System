const _ = require('lodash');
const moment = require('moment');
const request = require('async-request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const Queue = require("../entities/queue");
const Appointment = require('../entities/appointment');
const Participant = require('../entities/participant');

exports.createQueue = async (req, res, next) => {
    const user = req.url.split('/')[1];

    if (!_.isEmpty(req.body)) {
        const queue = new Queue({
            clinicId: req.body.clinicId,
            patientId: req.body.patientId
        });
        const results = await queue.add();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/' + user + '/queue'));
        else
            res.redirect(parse_uri.parse(req, '/' + user + '/queue/create?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/' + user + '/queue/create?error=true'));
};

exports.editQueue_Admin = async (req, res, next) => {
    const queue = new Queue({
        queueId: req.body.queueId,
        apptId: req.body.apptId
    });
    const results = await queue.linkQueueWithApptId();

    if (results)
        res.redirect(parse_uri.parse(req, '/admin/queue/view-all?action=edit'));
    else
        res.redirect(parse_uri.parse(req, '/admin/queue/view-all?error=true'));
};

exports.suspendQueue = async (req, res, next) => {
    const queue = new Queue({
        clinicId: req.body.clinicId,
        patientId: req.body.patientId
    });
    const results = await queue.suspendQueue();

    if (results)
        res.redirect(parse_uri.parse(req, '/patient/queue'));
    else
        res.redirect(parse_uri.parse(req, '/patient/queue?action=cancel&error=true'));
};

exports.callQueue = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const appointment = new Appointment({
        staffId: req.session.userInfo.staffId
    });
    const check = await appointment.getDentistCurrentAppointment();

    // Prevent dentist from calling another queue while he/she has a current session
    if (!_.isEmpty(check))
        res.redirect(parse_uri.parse(req, '/' + user + '/queue/view-all?queue=in-session'));
    else {
        const queue = new Queue({
            queueId: req.body.queueId,
            queueStatus: req.body.status === 'Upcoming' || !req.body.status ? 'Waiting' : req.body.status
        });
        const results = await queue.callQueue();

        if (results) {
            //TODO: Flash number on display queue number page

            res.redirect(parse_uri.parse(req, '/' + user + '/queue/view-all?action=call-queue'));
        }
        else
            res.redirect(parse_uri.parse(req, '/' + user + '/queue/view-all?error=true'));
    }
};

exports.skipQueue = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const appointment = new Appointment({
        staffId: req.session.userInfo.staffId
    });
    const check = await appointment.getDentistCurrentAppointment();

    if (!_.isEmpty(check))
        res.redirect(parse_uri.parse(req, '/' + user + '/queue/view-all?queue=in-session'));
    else {
        const queue = new Queue({
            queueId: req.body.queueId
        });
        const results = await queue.skipQueue();

        if (results)
            res.redirect(parse_uri.parse(req, '/' + user + '/queue/view-all?action=skip-queue'));
        else
            res.redirect(parse_uri.parse(req, '/' + user + '/queue/view-all?error=true'));
    }
};

exports.suspendQueueById = async (req, res, next) => {
    const queue = new Queue({
        queueId: req.body.queueId
    });
    const results = await queue.suspendQueueById();

    if (results)
        res.redirect(parse_uri.parse(req, '/admin/queue/view-all?action=suspend'));
    else
        res.redirect(parse_uri.parse(req, '/admin/queue/view-all?error=true'));
};

exports.startSession = async (req, res, next) => {
    const status = 'In Session';

    let appointment = new Appointment({
        staffId: req.session.userInfo.staffId
    });
    const check = await appointment.getDentistCurrentAppointment();

    if (!_.isEmpty(check))
        res.redirect(parse_uri.parse(req, '/dentist/queue/view-all?queue=in-session'));
    else {
        appointment = new Appointment({
            apptId: req.body.apptId,
            status: status,
            staffId: req.body.staffId !== req.session.userInfo.staffId ? req.session.userInfo.staffId : 0
        });
        const apptResult = await appointment.updateAppointmentStatus();

        if (apptResult) {
            const queue = new Queue({
                queueId: req.body.queueId,
                queueStatus: status
            });
            const queueResult = await queue.updateQueueStatus();

            const participant = new Participant({
                apptId: req.body.apptId,
                staffId: req.session.userInfo.staffId
            });
            const participantResult = await participant.addParticipant();

            if (queueResult && participantResult)
                res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session'));
            else
                res.redirect(parse_uri.parse(req, '/dentist/queue/view-all?error=true'));
        }
        else
            res.redirect(parse_uri.parse(req, '/dentist/queue/view-all?error=true'));
    }
};

exports.viewQueues = async (req, res, next) => {
    const title = 'Queue @ Clinic';
    const path = '/queue';

    if (!req.query.clinicId) {
        // get patient info & list of clinics
        const clinicResponse = await request(parse_uri.parse(req, '/api/clinic/get/all'));

        let nearbyClinicData = [];
        if (!_.isEmpty(req.session.userInfo)) {
            if (req.session.userInfo.postal) {
                nearbyClinicData = await request(parse_uri.parse(req, '/api/clinic/get/all/' + req.session.userInfo.postal + '?type=district'));
                if (!nearbyClinicData.body)
                    nearbyClinicData = await request(parse_uri.parse(req, '/api/clinic/get/all/' + req.session.userInfo.postal + '?type=region'));
            }
        }

        if (clinicResponse.statusCode === HTTP_STATUS.NOT_FOUND)
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: title,
                path: path,
                query: req.query
            });
        else
            res.status(HTTP_STATUS.OK).render('detail/queue', {
                pageTitle: title,
                path: path,
                query: req.query,
                clinicData: JSON.parse(clinicResponse.body),
                nearbyClinicData: nearbyClinicData.body ? JSON.parse(nearbyClinicData.body) : []
            });
    }
    else {
        // get patient info & list of clinics
        const queueResponse = await request(parse_uri.parse(req, '/api/queue/get/count/' + req.query.clinicId));

        if (queueResponse.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('detail/queue', {
                pageTitle: title,
                path: path,
                query: req.query,
                queueData: JSON.parse(queueResponse.body)
            });
        }
        else {
            const clinicResponse = await request(parse_uri.parse(req, '/api/clinic/get/' + req.query.clinicId));
            const queueData = JSON.parse(clinicResponse.body);
            queueData.count = 0;

            res.status(HTTP_STATUS.NOT_FOUND).render('detail/queue', {
                pageTitle: title,
                path: path,
                query: req.query,
                queueData: queueData
            });
        }
    }
};

exports.viewCreateQueue = async (req, res, next) => {
    const user = req.url.split('/')[1];
    const title = 'Queue';
    const path = '/' + user + '/queue/create';

    if (user === 'patient') {
        // get patient info & list of clinics
        const patientResponse = await request(parse_uri.parse(req, '/api/patient/get/' + req.session.userInfo.userId));
        const clinicResponse = await request(parse_uri.parse(req, '/api/clinic/get/all'));
        const appointmentResponse = await request(parse_uri.parse(req, '/api/appointment/get/all/upcoming/' + req.session.userInfo.userId));

        let appointmentData = [];
        if (appointmentResponse.body) {
            appointmentData = JSON.parse(appointmentResponse.body);
            appointmentData = _.uniqBy(appointmentData, 'clinicId');
        }

        if (patientResponse.statusCode === HTTP_STATUS.NOT_FOUND || clinicResponse.statusCode === HTTP_STATUS.NOT_FOUND)
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: title,
                path: path,
                query: req.query
            });

        const patientObj = JSON.parse(patientResponse.body);

        // check if patient has existing queue number
        const queueResponse = await request(parse_uri.parse(req, '/api/queue/get/' + patientObj.patientId));
        if (patientResponse.statusCode === HTTP_STATUS.OK && !_.isEmpty(JSON.parse(queueResponse.body))) {
            res.redirect(parse_uri.parse(req, '/' + user + '/queue'));
        }
        else {
            res.status(HTTP_STATUS.OK).render('form/queue', {
                pageTitle: title,
                path: path,
                query: req.query,
                profileData: patientObj,
                clinicData: JSON.parse(clinicResponse.body),
                appointmentData: appointmentData
            });
        }
    }
};

exports.viewPatientQueueNumber = async (req, res, next) => {
    const user = req.url.split('/')[1];
    const title = 'Queue';
    const path = '/' + user + '/queue';

    const patientResponse = await request(parse_uri.parse(req, '/api/patient/get/' + req.session.userInfo.userId));

    if (patientResponse.statusCode === HTTP_STATUS.OK) {
        const patientObj = JSON.parse(patientResponse.body);

        const queueResponse = await request(parse_uri.parse(req, '/api/queue/get/' + patientObj.patientId));
        if (queueResponse.statusCode === HTTP_STATUS.OK) {
            const queueObj = JSON.parse(queueResponse.body);
            queueObj.queueDateTime = moment(queueObj.queueDateTime).format('YYYY-MM-DD HH:mm:ss');

            const clinicResponse = await request(parse_uri.parse(req, '/api/clinic/get/' + queueObj.clinicId));
            const queueCountResponse = await request(parse_uri.parse(req, '/api/queue/get/count/' + queueObj.clinicId));

            if (clinicResponse.statusCode === HTTP_STATUS.OK && queueCountResponse.statusCode === HTTP_STATUS.OK)
                res.status(HTTP_STATUS.OK).render('detail/queue_patient', {
                    pageTitle: title,
                    path: path,
                    query: req.query,
                    profileData: patientObj,
                    queueData: queueObj,
                    clinicData: JSON.parse(clinicResponse.body),
                    queueCount: JSON.parse(queueCountResponse.body).count
                });
            else
                res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                    pageTitle: title,
                    path: path,
                    query: req.query
                });
        }
        else
            res.redirect(parse_uri.parse(req, path + '/create'));
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).render('404', {
            pageTitle: title,
            path: path,
            query: req.query
        });
};

exports.viewClinicQueues = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const pageTitle = 'Queue';
    const path = '/' + user + '/queue/view-all';

    let results;
    const queue = new Queue({
        clinicId: req.session.userInfo.clinicId
    });
    if (user === 'admin')
        results = await queue.getClinicQueue();
    else if (user === 'dentist')
        results = await queue.getDentistQueue();

    if (!_.isEmpty(results)) {
        res.status(HTTP_STATUS.OK).render('table/queues', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            queueData: results
        });
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).render('table/queues', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            queueData: []
        });
};

exports.viewEditQueue_Admin = async (req, res, next) => {
    const user = req.url.split('/')[1];
    const title = 'Queue';
    const path = '/' + user + '/queue/edit';

    const queue = new Queue({
        queueId: req.params.queueId
    });
    const queueData = await queue.getPatientQueueInformation();

    if (!_.isEmpty(queueData)) {
        const appointment = new Appointment({
            clinicId: queueData.clinicId,
            patientId: queueData.patientId
        });
        const appointmentData = await appointment.getUpcomingApptByClinicAndPatient();

        if (!_.isEmpty(appointmentData))
            res.status(HTTP_STATUS.OK).render('form/queue', {
                pageTitle: title,
                path: path,
                query: req.query,
                queueData: queueData,
                appointmentData: appointmentData
            });
        else
            res.status(HTTP_STATUS.NOT_FOUND).render('form/queue', {
                pageTitle: title,
                path: path,
                query: req.query,
                queueData: queueData,
                appointmentData: []
            });
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).render('404', {
            pageTitle: title,
            path: path,
            query: req.query
        });
};