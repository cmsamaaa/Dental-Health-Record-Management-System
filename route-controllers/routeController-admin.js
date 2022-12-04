const request = require('request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.viewPatients = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/patient/get/all');
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('table/admin-patients', {
                pageTitle: 'Patient',
                path: '/admin/patient/view-all',
                patientData: JSON.parse(response.body)
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Patient',
                path: '/admin/patient/view-all'
            });
        }
    });
};

exports.createPatient = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('form/patient', {
        pageTitle: 'Patient',
        path: '/admin/patient/create'
    });
};

exports.viewAppointments = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/admin-appointments', {
        pageTitle: 'Appointment',
        path: '/admin/appointment/view-all'
    });
};

exports.createAppointment = async (req, res, next) => {
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

exports.viewInventory = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/admin-inventory', {
        pageTitle: 'Inventory',
        path: '/admin/inventory/view-all'
    });
};

exports.createInventory = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('form/inventory', {
        pageTitle: 'Inventory',
        path: '/admin/inventory/new-record'
    });
};

exports.viewBills = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/admin-bills', {
        pageTitle: 'Bill',
        path: '/admin/bill/view-all'
    });
};