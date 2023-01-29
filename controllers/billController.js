const _ = require('lodash');
const moment = require('moment');
const request = require('request');
const parse_uri = require('../lib/parse_uri');
const HTTP_STATUS = require('../constants/http_status');
const Bill = require('../entities/bill');
const Treatment = require('../entities/treatment');

exports.viewBills_Admin = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/admin-bills', {
        pageTitle: 'Bill',
        path: '/admin/bill/view-all',
        query: req.query
    });
};

exports.viewBills_Patient = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/patient-bills', {
        pageTitle: 'Bill',
        path: '/patient/bill/view-all',
        query: req.query
    });
};

exports.viewInvoice = async (req, res, next) => {
    const pathname = req.originalUrl.split('?')[0].split('/')[3];

    let title = 'Invoice';
    let path = '/admin/bill/' + pathname;
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

// exports.viewInvoicePrint = async (req, res, next) => {
//     res.status(HTTP_STATUS.OK).render('bill/invoice-print', {
//         pageTitle: 'Invoice',
//         path: '/invoice-print',
//         query: req.query
//     });
// };