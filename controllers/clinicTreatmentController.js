const _ = require('lodash');
const moment = require('moment');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const ClinicTreatment = require("../entities/clinicTreatment");

exports.createTreatment = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const clinicTreatment = new ClinicTreatment({
            ctName: req.body.ctName,
            ctPrice: req.body.ctPrice,
            clinicId: req.body.clinicId,
        });
        const results = await clinicTreatment.add();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/admin/treatment/view-all?action=create&id=' + results[0]));
        else
            res.redirect(parse_uri.parse(req, '/admin/treatment/create?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/treatment/create?error=true'));
};

exports.viewCreateTreatment = async (req, res, next) => {
    const pageTitle = 'Treatment';
    const path = '/admin/treatment/create';

    res.status(HTTP_STATUS.OK).render('form/clinicTreatment', {
        pageTitle: pageTitle,
        path: path,
        query: req.query
    });
};