const _ = require('lodash');
const request = require('request');
const moment = require('moment');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.createAppointment = async (req, res, next) => {
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

exports.viewAppointments = async (req, res, next) => {
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
                clinicInfo: req.session.clinicInfo
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

exports.viewBills = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/patient-bills', {
        pageTitle: 'Bill',
        path: '/patient/bill/view-all'
    });
};