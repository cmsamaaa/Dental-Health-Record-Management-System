const _ = require('lodash');
const moment = require('moment');
const request = require('request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.createAppointment = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/create');
    request.post({
        url: uri,
        form: req.body
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.CREATED)
            res.redirect(parse_uri.parse(req, '/' + req.body.userType + '/appointment/view-all?create=true&id=' + JSON.parse(body).apptId));
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
        if (response.statusCode === HTTP_STATUS.CREATED)
            res.redirect(parse_uri.parse(req, '/' + req.body.for + '/appointment/view-all?edit=true&apptId=' + req.body.apptId));
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
        if (response.statusCode === HTTP_STATUS.CREATED)
            res.redirect(parse_uri.parse(req, '/' + req.body.for + '/appointment/view-all?cancel=true&apptId=' + req.body.apptId));
        else
            res.redirect(parse_uri.parse(req, '/' + req.body.for + '/appointment/view-all?error=true'));
    });
};

exports.viewCreateAppointment_Admin = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/patient/get/all');
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('form/appointment', {
                pageTitle: 'Appointment',
                path: '/admin/appointment/create',
                userData: JSON.parse(response.body)
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Appointment',
                path: '/admin/appointment/create'
            });
        }
    });
};

exports.viewCreateAppointment_Patient = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/patient/get/' + req.session.userInfo.userId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('form/appointment', {
                pageTitle: 'Appointment',
                path: '/patient/appointment/create',
                userData: JSON.parse(response.body)
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Appointment',
                path: '/patient/appointment/create'
            });
        }
    });
};

exports.viewAppointments_Admin = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/get/all');
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            let data = JSON.parse(response.body);

            data = _.map(data, (appt) => {
                appt.apptDateTime = moment(new Date(appt.apptDateTime)).format('DD/MM/YYYY hh:mmA');
                return appt;
            });

            res.status(HTTP_STATUS.OK).render('table/appointments', {
                pageTitle: 'Appointment',
                path: '/admin/appointment/view-all',
                appointmentData: data
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Appointment',
                path: '/admin/appointment/view-all'
            });
        }
    });
};

exports.viewAppointments_Patient = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/get/all/' + req.session.userInfo.userId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            let data = JSON.parse(response.body);

            data = _.map(data, (appt) => {
                appt.apptDateTime = moment(new Date(appt.apptDateTime)).format('DD/MM/YYYY hh:mmA');
                return appt;
            });

            res.status(HTTP_STATUS.OK).render('table/appointments', {
                pageTitle: 'Appointment',
                path: '/patient/appointment/view-all',
                appointmentData: data,
                clinicName: req.session.clinicInfo['Clinic Name'],
                clinicAddress: req.session.clinicInfo['Address'] + ", #" + req.session.clinicInfo['Unit'] + ", (S)" + req.session.clinicInfo['Postal']
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Appointment',
                path: '/patient/appointment/view-all'
            });
        }
    });
};

exports.viewAppointments_Dentist = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/get/all');
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            let data = JSON.parse(response.body);

            data = _.map(data, (appt) => {
                appt.apptDateTime = moment(new Date(appt.apptDateTime)).format('DD/MM/YYYY hh:mmA');
                return appt;
            });

            res.status(HTTP_STATUS.OK).render('table/appointments', {
                pageTitle: 'Appointment',
                path: '/dentist/appointment/view-all',
                appointmentData: data
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Appointment',
                path: '/dentist/appointment/view-all'
            });
        }
    });
};

exports.viewEditAppointment_Admin = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/get/' + req.params.apptId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            let data = JSON.parse(response.body);

            data.apptDateTime = moment(new Date(data.apptDateTime)).format('DD/MM/YYYY HH:mm');

            res.status(HTTP_STATUS.OK).render('form/appointment', {
                pageTitle: 'Appointment',
                path: '/admin/appointment/edit',
                userData: data
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Appointment',
                path: '/admin/appointment/edit',
            });
        }
    });
};

exports.viewEditAppointment_Patient = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/appointment/get/' + req.params.apptId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            let data = JSON.parse(response.body);

            data.apptDateTime = moment(new Date(data.apptDateTime)).format('DD/MM/YYYY HH:mm');

            res.status(HTTP_STATUS.OK).render('form/appointment', {
                pageTitle: 'Appointment',
                path: '/patient/appointment/edit',
                userData: data
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Appointment',
                path: '/patient/appointment/edit',
            });
        }
    });
};