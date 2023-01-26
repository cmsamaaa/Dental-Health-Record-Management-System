const _ = require('lodash');
const moment = require('moment');
const request = require('request');
const parse_uri = require('../lib/parse_uri');
const HTTP_STATUS = require('../constants/http_status');
const Bill = require('../entities/bill');

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
    let title = 'Invoice';
    let path = '/admin/bill/invoice';
    let billData;
    if (req.query.apptId) {
        const bill = new Bill({
            apptId: req.query.apptId
        });
        billData = await bill.getBillByApptId();

        billData.dueDate = moment(billData.billDateTime).add(1, 'd').format('DD/MM/YYYY');
        billData.billDateTime = moment(billData.billDateTime).format('DD/MM/YYYY HH:mm:ss');
        billData.paymentDateTime = billData.paymentDateTime ? moment(billData.paymentDateTime).format('DD/MM/YYYY HH:mm:ss') : null;
    }
    // else if (req.params.billId) {

    // }
    // else {

    // }

    res.status(HTTP_STATUS.OK).render('bill/invoice', {
        pageTitle: title,
        path: path,
        query: req.query,
        billData: billData,
        invoiceNum: billData.billId < 1000000 ? String(billData.billId).padStart(6, '0') : billData.billId
    });
};

exports.viewInvoicePrint = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('bill/invoice-print', {
        pageTitle: 'Invoice',
        path: '/invoice-print',
        query: req.query
    });
};