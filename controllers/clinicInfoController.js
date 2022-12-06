const _ = require('lodash');
const request = require('request');
const ClinicInfo = require('../entities/clinicInfo');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.addClinicInfo = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const clinicInfo = new ClinicInfo(req.body);
        const results = await clinicInfo.add();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/admin/clinic/view-all?create=' + true));
        else
            res.redirect(parse_uri.parse(req, '/admin/clinic/add-information?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/clinic/add-information?error=true'));
};

exports.viewAddClinicInfo = async (req, res, next) => {
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