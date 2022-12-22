const _ = require('lodash');
const request = require('request');
const Clinic = require('../entities/clinic');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.register = async (req, res, next) => {
    // register clinic
};

exports.edit = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const clinic = new Clinic(req.body);
        const results = await clinic.updateClinic();

        if (results)
            res.redirect(parse_uri.parse(req, '/admin/clinic?action=edit'));
        else
            res.redirect(parse_uri.parse(req, '/admin/clinic/edit/' + req.body.clinicId + '?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/clinic/edit/' + req.body.clinicId + '?error=true'));
};

exports.viewClinicInfo = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/clinic/get/' + req.session.userInfo.clinicId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('detail/clinic', {
                pageTitle: 'Clinic',
                path: '/admin/clinic',
                query: req.query,
                clinicData: JSON.parse(response.body)
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Clinic',
                path: '/admin/clinic'
            });
        }
    });
};

exports.viewEditClinicInfo = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/clinic/get/' + req.params.clinicId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('form/clinic', {
                pageTitle: 'Clinic',
                path: '/admin/clinic/edit/' + req.params.clinicId,
                query: req.query,
                clinicData: JSON.parse(response.body)
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Clinic',
                path: '/admin/clinic/edit' + req.params.clinicId
            });
        }
    });
};