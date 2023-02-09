const _ = require('lodash');
const moment = require('moment');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const ClinicTreatment = require("../entities/clinicTreatment");

exports.createTreatment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    if (!_.isEmpty(req.body)) {
        const clinicTreatment = new ClinicTreatment({
            ctName: req.body.ctName,
            ctPrice: req.body.ctPrice,
            clinicId: req.body.clinicId,
        });
        const results = await clinicTreatment.add();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/' + user + '/treatment/view-all?action=create&id=' + results[0]));
        else
            res.redirect(parse_uri.parse(req, '/' + user + '/treatment/create?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/' + user + '/treatment/create?error=true'));
};

exports.editTreatment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const clinicTreatment = new ClinicTreatment({
        ctId: req.body.ctId,
        ctName: req.body.ctName,
        ctPrice: req.body.ctPrice,
    });
    const result = await clinicTreatment.updateClinicTreatment();

    if (result)
        res.redirect(parse_uri.parse(req, '/' + user + '/treatment/view-all?action=edit&ctId=' + req.body.ctId));
    else
        res.redirect(parse_uri.parse(req, '/' + user + '/treatment/view-all?error=true'));
};

exports.suspendTreatment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const clinicTreatment = new ClinicTreatment({
        ctId: req.body.ctId
    });
    const result = await clinicTreatment.suspend();

    if (result)
        res.redirect(parse_uri.parse(req, '/' + user + '/treatment/view-all?action=suspend&ctId=' + req.body.ctId));
    else
        res.redirect(parse_uri.parse(req, '/' + user + '/treatment/view-all?error=true'));
};

exports.reactivateTreatment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const clinicTreatment = new ClinicTreatment({
        ctId: req.body.ctId
    });
    const result = await clinicTreatment.reactivate();

    if (result)
        res.redirect(parse_uri.parse(req, '/' + user + '/treatment/view-all?action=reactivate&ctId=' + req.body.ctId));
    else
        res.redirect(parse_uri.parse(req, '/' + user + '/treatment/view-all?error=true'));
};

exports.viewCreateTreatment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const pageTitle = 'Treatment';
    const path = '/' + user + '/treatment/create';

    res.status(HTTP_STATUS.OK).render('form/clinicTreatment', {
        pageTitle: pageTitle,
        path: path,
        query: req.query,
        userRole: user
    });
};

exports.viewEditTreatment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const pageTitle = 'Treatment';
    const path = '/' + user + '/treatment/edit';

    const clinicTreatment = new ClinicTreatment({
        ctId: req.params.ctId
    });
    const result = await clinicTreatment.get();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('form/clinicTreatment', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            treatmentData: result,
            userRole: user
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/treatment/view-all?error=true'));
};

exports.viewTreatments = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const pageTitle = 'Treatment';
    const path = '/' + user + '/treatment/view-all';

    const clinicTreatment = new ClinicTreatment({
        clinicId: req.session.userInfo.clinicId
    });
    const result = await clinicTreatment.getAll();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('table/clinicTreatments', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            treatmentData: result,
            userRole: user
        });
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).render('table/clinicTreatments', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            treatmentData: [],
            userRole: user
        });
};

exports.viewTreatment = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const pageTitle = 'Treatment';
    const path = '/' + user + '/treatment/view';

    const clinicTreatment = new ClinicTreatment({
        ctId: req.params.ctId
    });
    const result = await clinicTreatment.get();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('detail/clinicTreatment', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            treatmentData: result,
            userRole: user
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/treatment/view-all?error=true'));
};

exports.viewCompareTreatments = async (req, res, next) => {
    const pageTitle = 'Treatment';
    const path = '/clinic/treatments/compare';

    const clinicTreatment = new ClinicTreatment({
        ctName: req.query.treatmentName
    });
    const result = await clinicTreatment.getCompare();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('table/compare-treatments', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            treatmentData: result
        });
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).render('table/compare-treatments', {
            pageTitle: pageTitle,
            path: path,
            query: req.query,
            treatmentData: []
        });
};