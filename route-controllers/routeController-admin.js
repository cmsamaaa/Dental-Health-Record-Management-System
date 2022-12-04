const _ = require('lodash');
const request = require('request');
const moment = require('moment');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.addClinicInfo = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('form/clinic-info', {
        pageTitle: 'Clinic',
        path: '/admin/clinic/add-information'
    });
};

exports.viewClinicInfo = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/info/get/all');
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('table/clinic-info', {
                pageTitle: 'Clinic',
                path: '/admin/clinic/view-all',
                clinicInfoData: JSON.parse(response.body)
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Clinic',
                path: '/admin/clinic/view-all'
            });
        }
    });
};

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

exports.viewAppointments = async (req, res, next) => {
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