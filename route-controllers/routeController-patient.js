const request = require('request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.createAppointment = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/user/get/nric/all');
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
    res.status(HTTP_STATUS.OK).render('table/patient-appointments', {
        pageTitle: 'Appointment',
        path: '/patient/appointment/view-all'
    });
};

exports.viewBills = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/patient-bills', {
        pageTitle: 'Bill',
        path: '/patient/bill/view-all'
    });
};