const _ = require('lodash');
const moment = require('moment');
const request = require('request');
const async_request = require('async-request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const Appointment = require("../entities/appointment");
const ClinicTreatment = require("../entities/clinicTreatment");
const Treatment = require("../entities/treatment");

exports.createAppointment = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/create');
    request.post({
        url: uri,
        form: req.body
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.CREATED)
            res.redirect(parse_uri.parse(req, '/' + req.body.userType + '/appointment/view-all?action=create&id=' + JSON.parse(body).apptId));
        else
            res.redirect(parse_uri.parse(req, '/' + req.body.userType + '/appointment/create?error=true'));
    });
};

exports.editAppointment = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/edit');
    request.post({
        url: uri,
        form: req.body
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK)
            res.redirect(parse_uri.parse(req, '/' + req.body.for + '/appointment/view-all?action=edit&id=' + req.body.apptId));
        else
            res.redirect(parse_uri.parse(req, '/' + req.body.for + '/appointment/view-all?error=true'));
    });
};

exports.suspendAppointment = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/suspend');
    request.post({
        url: uri,
        form: req.body
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK)
            res.redirect(parse_uri.parse(req, '/' + req.body.for + '/appointment/view-all?action=cancel&id=' + req.body.apptId));
        else
            res.redirect(parse_uri.parse(req, '/' + req.body.for + '/appointment/view-all?error=true'));
    });
};

exports.viewCreateAppointment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    if (user === 'patient') {
        // api endpoint uri
        const uri = parse_uri.parse(req, '/api/patient/get/' + req.session.userInfo.userId);
        request.get({
            url: uri,
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
                                clinicData: JSON.parse(response.body)
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

            userData.startDateTime = moment(new Date(userData.startDateTime)).format('DD/MM/YYYY HH:mm');
            userData.endDateTime = moment(new Date(userData.endDateTime)).format('DD/MM/YYYY HH:mm');

            request.get({
                url: parse_uri.parse(req, '/api/dentist/get/' + userData.staffId)
            }, (err, response, body) => {
                if (response.statusCode === HTTP_STATUS.OK) {
                    res.status(HTTP_STATUS.OK).render('form/appointment', {
                        pageTitle: 'Appointment',
                        path: '/' + user + '/appointment/edit',
                        query: req.query,
                        dentistData: JSON.parse(response.body),
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

    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/get/' + req.params.apptId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            let userData = JSON.parse(response.body);

            userData.startDateTime = moment(new Date(userData.startDateTime)).format('DD/MM/YYYY HH:mm');
            userData.endDateTime = moment(new Date(userData.endDateTime)).format('DD/MM/YYYY HH:mm');

            request.get({
                url: parse_uri.parse(req, '/api/dentist/get/' + userData.staffId)
            }, (err, response, body) => {
                if (response.statusCode === HTTP_STATUS.OK) {
                    res.status(HTTP_STATUS.OK).render('detail/appointment', {
                        pageTitle: 'Appointment',
                        path: '/' + user + '/appointment/edit',
                        query: req.query,
                        dentistData: JSON.parse(response.body),
                        userData: userData,
                        userRole: user
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

exports.viewInSessionAppointment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const title = 'Appointment';
    const path = '/' + user + '/appointment/in-session';

    // Get appointment in-session by staffId
    let appointment = new Appointment({
        staffId: req.session.userInfo.staffId
    });
    const appointmentData = await appointment.getDentistCurrentAppointment();

    if (!_.isEmpty(appointmentData)) {
        // Get dentist info
        const dentistResponse = await async_request(parse_uri.parse(req, '/api/dentist/get/' + appointmentData.staffId));

        if (dentistResponse.statusCode === HTTP_STATUS.OK) {
            // Get clinic's treatment data
            const clinicTreatment = new ClinicTreatment({ clinicId: appointmentData.clinicId });
            const clinicTreatmentData = await clinicTreatment.getAllActive();

            // Get current appointment's treatment data
            const treatment = new Treatment({ apptId: appointmentData.apptId });
            const treatmentData = await treatment.getAllTreatments();

            res.status(HTTP_STATUS.OK).render('detail/appointment_in_session', {
                pageTitle: title,
                path: path,
                query: req.query,
                appointmentData: appointmentData,
                userData: appointmentData,
                dentistData: JSON.parse(dentistResponse.body),
                clinicTreatmentData: !_.isEmpty(clinicTreatmentData) ? clinicTreatmentData : [],
                treatmentData: !_.isEmpty(treatmentData) ? treatmentData : []
            });
        }
        else
            res.redirect(parse_uri.parse(req, '/' + user + '/appointment/view-all'));
    }
    else
        res.redirect(parse_uri.parse(req, '/' + user + '/appointment/view-all'));
};