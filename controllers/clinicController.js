const _ = require('lodash');
const request = require('request');
const Clinic = require('../entities/clinic');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.register = async (req, res, next) => {
    // register clinic
};

exports.viewClinicInfo = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/clinic/get/' + req.session.userInfo.clinicId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('table/clinic-info', {
                pageTitle: 'Clinic',
                path: '/admin/clinic/view-all',
                query: req.query,
                clinicData: JSON.parse(response.body)
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