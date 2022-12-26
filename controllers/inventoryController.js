const _ = require('lodash');
const request = require('request');
const Inventory = require('../entities/inventory');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.viewInventory = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/admin-inventory', {
        pageTitle: 'Inventory',
        path: '/admin/inventory/view-all',
        query: req.query
    });
};

exports.createInventory = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const inventory = new Inventory({ 
            name: req.body.itemName,
            quantity: req.body.quantity,
            costPerUnit: req.body.cost,
            expiryDate: req.body.expiry,
            inboundDate: req.body.inbound,
            SKU: req.body.SKU,
            UPC: req.body.UPC,
            note: req.body.note,
        });
        const results = await inventory.createInventory();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/admin/inventory/view-all?action=create&id=' + results[0]));
        else
            res.redirect(parse_uri.parse(req, '/admin/inventory/create?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/inventory/create?error=true'));
};

exports.viewCreateInventory = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('form/inventory', {
        pageTitle: 'Inventory',
        path: '/admin/inventory/create',
        query: req.query
    });
};