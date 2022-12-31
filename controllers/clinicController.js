const _ = require('lodash');
const request = require('request');
const Clinic = require('../entities/clinic');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.register = async (req, res, next) => {
    // TODO: register clinic
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

exports.findClinicsByPostal = async (req, res, next) => {
    const pageTitle = 'Find Clinics Near Me';
    const path = '/clinic/search';

    if (req.query.type === 'district' || req.query.type === 'region') {
        const uri = parse_uri.parse(req, '/api/clinic/get/all/' + req.query.postal);
        request.get({
            url: uri
        }, (err, response, body) => {
            if (response.statusCode === HTTP_STATUS.OK) {
                res.status(HTTP_STATUS.OK).render('table/clinics-nearby', {
                    pageTitle: pageTitle,
                    path: path,
                    query: req.query,
                    clinicsData: JSON.parse(response.body)
                });
            }
            else {
                res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                    pageTitle: pageTitle,
                    path: path,
                    clinicsData: null
                });
            }
        });
    }
    else {
        res.status(HTTP_STATUS.OK).render('table/clinics-nearby', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            clinicsData: null
        });
    }
};

exports.viewClinicInfo = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const pageTitle = 'Clinic';
    let path = '/clinic/view';
    let clinicId = -1;

    if (req.session.userInfo) {
        if (req.params.clinicId)
            clinicId = req.params.clinicId;
        else {
            path = '/' + user + '/clinic';
            clinicId = req.session.userInfo.clinicId;
        }
    }
    else {
        if (req.params.clinicId)
            clinicId = req.params.clinicId;
    }

    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/clinic/get/' + clinicId);
    request.get({
        url: uri,
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.OK) {
            res.status(HTTP_STATUS.OK).render('detail/clinic', {
                pageTitle: pageTitle,
                path: path,
                query: req.query,
                clinicData: JSON.parse(response.body)
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: pageTitle,
                path: path
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
                path: '/admin/clinic/edit',
                query: req.query,
                clinicData: JSON.parse(response.body)
            });
        }
        else {
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: 'Clinic',
                path: '/admin/clinic/edit'
            });
        }
    });
};