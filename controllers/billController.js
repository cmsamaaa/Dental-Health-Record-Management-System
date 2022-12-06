const _ = require('lodash');
const request = require('request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.viewBills_Admin = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/admin-bills', {
        pageTitle: 'Bill',
        path: '/admin/bill/view-all'
    });
};

exports.viewBills_Patient = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/patient-bills', {
        pageTitle: 'Bill',
        path: '/patient/bill/view-all'
    });
};

exports.viewInvoice = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('bill/invoice', {
        pageTitle: 'Invoice',
        path: '/invoice'
    });
};

exports.viewInvoicePrint = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('bill/invoice-print', {
        pageTitle: 'Invoice',
        path: '/invoice-print'
    });
};