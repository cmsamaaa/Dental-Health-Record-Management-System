const _ = require('lodash');
const moment = require('moment');
const request = require('request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const Appointment = require("../entities/appointment");

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
    let user = req.url.split('/')[1];

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
                            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                                pageTitle: 'Appointment',
                                path: '/' + user + '/appointment/create',
                                query: req.query
                            });
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
    let user = req.url.split('/')[1];

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
    let user = req.url.split('/')[1];

    if (user === 'admin') {
        const appointment = new Appointment();
        const results = await appointment.getAllClinicAppointments();

        if (!_.isEmpty(results)) {
            let apptData = results;

            apptData = _.map(apptData, (appt) => {
                appt.startDateTime = moment(new Date(appt.startDateTime)).format('YYYY-MM-DD HH:mm');
                appt.endDateTime = moment(new Date(appt.endDateTime)).format('YYYY-MM-DD HH:mm');
                return appt;
            });

            res.status(HTTP_STATUS.OK).render('table/appointments', {
                pageTitle: 'Appointment',
                path: '/' + user + '/appointment/view-all',
                query: req.query,
                appointmentData: apptData
            });
        }
        else
            res.status(HTTP_STATUS.NOT_FOUND).json({});
    }

    if (user === 'dentist') {
        const appointment = new Appointment({
            staffId: req.session.userInfo.staffId
        });
        const results = await appointment.getAllUpcomingAppointments();

        if (!_.isEmpty(results)) {
            let apptData = results;

            apptData = _.map(apptData, (appt) => {
                appt.startDateTime = moment(new Date(appt.startDateTime)).format('YYYY-MM-DD HH:mm');
                appt.endDateTime = moment(new Date(appt.endDateTime)).format('YYYY-MM-DD HH:mm');
                return appt;
            });

            res.status(HTTP_STATUS.OK).render('table/appointments', {
                pageTitle: 'Appointment',
                path: '/' + user + '/appointment/view-all',
                query: req.query,
                appointmentData: apptData
            });
        }
        else
            res.status(HTTP_STATUS.NOT_FOUND).json({});
    }

    if (user === 'patient') {
        let path = '/api/appointment/get/all/' + req.session.userInfo.userId;

        // api endpoint uri
        const uri = parse_uri.parse(req, path);

        request.get({
            url: uri,
        }, (err, response, body) => {
            let apptData = JSON.parse(response.body);

            apptData = _.map(apptData, (appt) => {
                appt.startDateTime = moment(new Date(appt.startDateTime)).format('YYYY-MM-DD HH:mm');
                appt.endDateTime = moment(new Date(appt.endDateTime)).format('YYYY-MM-DD HH:mm');
                return appt;
            });

            res.status(HTTP_STATUS.OK).render('table/appointments', {
                pageTitle: 'Appointment',
                path: '/' + user + '/appointment/view-all',
                query: req.query,
                appointmentData: apptData
            });
        });
    }
};

exports.viewAppointment = async (req, res, next) => {
    let user = req.url.split('/')[1];

    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/get/' + req.params.apptId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            let data = JSON.parse(response.body);

            data.startDateTime = moment(new Date(data.startDateTime)).format('DD/MM/YYYY HH:mm');
            data.endDateTime = moment(new Date(data.endDateTime)).format('DD/MM/YYYY HH:mm');

            res.status(HTTP_STATUS.OK).render('detail/appointment', {
                pageTitle: 'Appointment',
                path: '/' + user + '/appointment/view',
                query: req.query,
                userData: data,
                userRole: user
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Appointment',
                path: '/' + user + '/appointment/view',
                query: req.query
            });
        }
    });
};