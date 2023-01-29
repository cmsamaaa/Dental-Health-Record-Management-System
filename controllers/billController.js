const _ = require('lodash');
const moment = require('moment');
const request = require('request');
const parse_uri = require('../lib/parse_uri');
const HTTP_STATUS = require('../constants/http_status');
const Bill = require('../entities/bill');
const Treatment = require('../entities/treatment');

exports.viewBills = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const title = 'Bills';
    const path = '/' + user + '/bill/view-all';
    let billData = [];

    if (user === 'admin') {
        const bill = new Bill();
        billData = await bill.getClinicBills(req.session.userInfo.clinicId);
    }
    else if (user === 'patient') {
        const bill = new Bill();
        billData = await bill.getUserBills(req.session.userInfo.userId);
    }
    else {
        res.status(HTTP_STATUS.OK).render('404', {
            pageTitle: title,
            path: path,
            query: req.query
        });
    }

    res.status(HTTP_STATUS.OK).render('table/bills', {
        pageTitle: title,
        path: path,
        query: req.query,
        billData: billData
    });
};

exports.viewInvoice = async (req, res, next) => {
    const user = req.url.split('/')[1];
    const pathname = req.originalUrl.split('?')[0].split('/')[3];

    const title = 'Invoice';
    const path = '/' + user + '/bill/' + pathname;

    let billData = {};
    let treatmentData = [];

    if (req.query.billId) {
        const bill = new Bill({ billId: req.query.billId });
        billData = await bill.getBill();

        const treatment = new Treatment({ apptId: billData.apptId });
        treatmentData = await treatment.getAllTreatments();
    }
    else if (req.query.apptId) {
        const bill = new Bill({ apptId: req.query.apptId });
        billData = await bill.getBillByApptId();

        const treatment = new Treatment({ apptId: req.query.apptId });
        treatmentData = await treatment.getAllTreatments();
    }
    else {
        res.status(HTTP_STATUS.OK).render('404', {
            pageTitle: title,
            path: path,
            query: req.query
        });
    }

    billData.dueDate = moment(billData.billDateTime).add(1, 'd').format('DD/MM/YYYY');
    billData.billDateTime = moment(billData.billDateTime).format('DD/MM/YYYY HH:mm:ss');
    billData.paymentDateTime = billData.paymentDateTime ? moment(billData.paymentDateTime).format('DD/MM/YYYY HH:mm:ss') : null;

    res.status(HTTP_STATUS.OK).render('bill/' + pathname, {
        pageTitle: title,
        path: path,
        query: req.query,
        billData: billData,
        invoiceNum: billData.billId < 1000000 ? String(billData.billId).padStart(6, '0') : billData.billId,
        treatmentData: treatmentData
    });
};