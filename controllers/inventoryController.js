const _ = require('lodash');
const request = require('request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.viewInventory = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/admin-inventory', {
        pageTitle: 'Inventory',
        path: '/admin/inventory/view-all'
    });
};

exports.viewCreateInventory = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('form/inventory', {
        pageTitle: 'Inventory',
        path: '/admin/inventory/new-record'
    });
};