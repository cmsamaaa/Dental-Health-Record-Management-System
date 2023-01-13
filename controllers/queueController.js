const _ = require('lodash');
const moment = require('moment');
const request = require('async-request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const Queue = require("../entities/queue");

exports.createQueue = async (req, res, next) => {
    const user = req.url.split('/')[1];

    if (!_.isEmpty(req.body)) {
        const queue = new Queue({
            clinicId: req.body.clinicId,
            patientId: req.body.patientId
        });
        const results = await queue.add();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/' + user + '/queue'));
        else
            res.redirect(parse_uri.parse(req, '/' + user + '/queue/create?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/' + user + '/queue/create?error=true'));
};

exports.suspendQueue = async (req, res, next) => {
    const queue = new Queue({
        clinicId: req.body.clinicId,
        patientId: req.body.patientId
    });
    const results = await queue.suspendQueue();

    if (!_.isEmpty(results))
        res.redirect(parse_uri.parse(req, '/patient/queue'));
    else
        res.redirect(parse_uri.parse(req, '/patient/queue?action=cancel&error=true'));
};

exports.viewCreateQueue = async (req, res, next) => {
    const user = req.url.split('/')[1];
    const title = 'Queue';
    const path = '/' + user + '/queue/create';

    if (user === 'patient') {
        // get patient info & list of clinics
        const patientResponse = await request(parse_uri.parse(req, '/api/patient/get/' + req.session.userInfo.userId));
        const clinicResponse = await request(parse_uri.parse(req, '/api/clinic/get/all'));

        if (patientResponse.statusCode === HTTP_STATUS.NOT_FOUND || clinicResponse.statusCode === HTTP_STATUS.NOT_FOUND)
            res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                pageTitle: title,
                path: path,
                query: req.query
            });

        const patientObj = JSON.parse(patientResponse.body);

        // check if patient has existing queue number
        const queueResponse = await request(parse_uri.parse(req, '/api/queue/get/' + patientObj.patientId));
        if (patientResponse.statusCode === HTTP_STATUS.OK && !_.isEmpty(JSON.parse(queueResponse.body))) {
            res.redirect(parse_uri.parse(req, '/' + user + '/queue'));
        }
        else {
            res.status(HTTP_STATUS.OK).render('form/queue', {
                pageTitle: title,
                path: path,
                query: req.query,
                profileData: patientObj,
                clinicData: JSON.parse(clinicResponse.body)
            });
        }
    }
};

exports.viewPatientQueueNumber = async (req, res, next) => {
    const user = req.url.split('/')[1];
    const title = 'Queue';
    const path = '/' + user + '/queue';

    const patientResponse = await request(parse_uri.parse(req, '/api/patient/get/' + req.session.userInfo.userId));

    if (patientResponse.statusCode === HTTP_STATUS.OK) {
        const patientObj = JSON.parse(patientResponse.body);

        const queueResponse = await request(parse_uri.parse(req, '/api/queue/get/' + patientObj.patientId));
        if (queueResponse.statusCode === HTTP_STATUS.OK) {
            const queueObj = JSON.parse(queueResponse.body);
            queueObj.queueDateTime = moment(queueObj.queueDateTime).format('YYYY-MM-DD HH:mm:ss');

            const clinicResponse = await request(parse_uri.parse(req, '/api/clinic/get/' + queueObj.clinicId));

            if (queueResponse.statusCode === HTTP_STATUS.OK)
                res.status(HTTP_STATUS.OK).render('detail/queue_patient', {
                    pageTitle: title,
                    path: path,
                    query: req.query,
                    profileData: patientObj,
                    queueData: queueObj,
                    clinicData: JSON.parse(clinicResponse.body)
                });
            else
                res.status(HTTP_STATUS.NOT_FOUND).render('404', {
                    pageTitle: title,
                    path: path,
                    query: req.query
                });
        }
        else
            res.redirect(parse_uri.parse(req, path + '/create'));
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).render('404', {
            pageTitle: title,
            path: path,
            query: req.query
        });
};