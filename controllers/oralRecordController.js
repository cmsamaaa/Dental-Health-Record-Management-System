const _ = require('lodash');
const oralRecord = require('../entities/oralRecord');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.create = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const oralrecord = new oralRecord({ 
            recordTeeth: req.body.recordTeeth,
            recordDescription: req.body.recordDescription,
            recordCreatedAt: req.body.recordCreatedAt,
            patientId: req.body.patientId
        });
        const results = await oralrecord.add();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/dentist/oralrecord/view-all?action=create&id=' + results[0]));
        else
            res.redirect(parse_uri.parse(req, '/dentist/oralrecord/create?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oralrecord/create?error=true'));
};

exports.edit = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const oralrecord = new oralRecord(req.body);
        const results = await oralrecord.update();

        if (results)
            res.redirect(parse_uri.parse(req, '/dentist/oralrecord/view-all?action=edit&inventoryId=' + req.body.inventoryId));
        else
            res.redirect(parse_uri.parse(req, '/dentist/oralrecord/edit/' + req.body.inventoryId + '?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oralrecord/edit/' + req.body.inventoryId + '?error=true'));
};

exports.viewRecords = async (req, res, next) => {
    const oralrecord = new oralRecord({
        recordId: req.params.recordId
    });
    const result = await oralrecord.getAll();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('table/dentist-oralRecord', {
            pageTitle: 'Oral Record',
            path: '/dentist/oralrecord/view-all',
            query: req.query,
            inventoryData: result
        });
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).render('dentist-oralRecord', {
            pageTitle: 'Oral Record',
            path: '/dentist/oralrecord/view-all',
            query: req.query,
            inventoryData: []
        });
};

exports.viewRecord = async (req, res, next) => {
    const oralrecord = new oralRecord({
        recordId: req.params.recordId
    });
    const result = await oralrecord.get();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('detail/oralRecord', {
            pageTitle: 'Oral Record',
            path: '/dentist/oralrecord/view',
            query: req.query,
            inventoryData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oralrecord/view-all?error=true'));
};

exports.viewEdit = async (req, res, next) => {
    const oralrecord = new oralRecord({
        recordId: req.params.recordId
    });
    const result = await oralrecord.get();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('form/oralRecord', {
            pageTitle: 'Oral Record',
            path: '/dentist/oralrecord/edit',
            query: req.query,
            inventoryData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/dentist/oralrecord/view-all?error=true'));
};

exports.viewCreate = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('form/oralRecord', {
        pageTitle: 'Oral Record',
        path: '/dentist/oralrecord/create',
        query: req.query
    });
};