const _ = require('lodash');
const request = require('request');
const Inventory = require('../entities/inventory');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.createInventory = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const inventory = new Inventory({
            name: req.body.itemName,
            quantity: req.body.quantity,
            minQuantity: req.body.minQuantity,
            costPerUnit: req.body.cost,
            expiryDate: req.body.expiry,
            inboundDate: req.body.inbound,
            SKU: req.body.SKU,
            UPC: req.body.UPC,
            note: req.body.note,
            clinicId: req.session.userInfo.clinicId
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

exports.editInventory = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const inventory = new Inventory(req.body);
        const results = await inventory.updateInventory();

        if (results)
            res.redirect(parse_uri.parse(req, '/admin/inventory/view-all?action=edit&inventoryId=' + req.body.inventoryId));
        else
            res.redirect(parse_uri.parse(req, '/admin/inventory/edit/' + req.body.inventoryId + '?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/inventory/edit/' + req.body.inventoryId + '?error=true'));
};

exports.viewInventories = async (req, res, next) => {
    const inventory = new Inventory({
        clinicId: req.session.userInfo.clinicId
    });

    let inventoryData = [];

    if (req.query.filter) {
        if (req.query.filter === 'all')
            inventoryData = await inventory.getAllInventories();
        else if (req.query.filter === 'low')
            inventoryData = await inventory.getLowStocks();
    }
    else
        inventoryData = await inventory.getAllInventories();

    if (!_.isEmpty(inventoryData)) {
        res.status(HTTP_STATUS.OK).render('table/inventory', {
            pageTitle: 'Inventory',
            path: '/admin/inventory/view-all',
            query: req.query,
            inventoryData: inventoryData
        });
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).render('table/inventory', {
            pageTitle: 'Inventory',
            path: '/admin/inventory/view-all',
            query: req.query,
            inventoryData: []
        });
};

exports.viewInventory = async (req, res, next) => {
    const inventory = new Inventory({
        inventoryId: req.params.inventoryId
    });
    const result = await inventory.getInventory();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('detail/inventory', {
            pageTitle: 'Inventory',
            path: '/admin/inventory/view',
            query: req.query,
            inventoryData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/inventory/view-all?error=true'));
};

exports.suspendInventory = async (req, res, next) => {
    const inventory = new Inventory({
        inventoryId: req.body.inventoryId
    });
    const results = await inventory.suspendInventory();

    if (results)
        res.redirect(parse_uri.parse(req, '/admin/inventory/view-all?action=suspend&inventoryId=' + req.body.inventoryId));
    else
        res.redirect(parse_uri.parse(req, '/admin/inventory/view-all?error=true'));
};

exports.reactivateInventory = async (req, res, next) => {
    const inventory = new Inventory({
        inventoryId: req.body.inventoryId
    });
    const results = await inventory.reactivateInventory();

    if (results)
        res.redirect(parse_uri.parse(req, '/admin/inventory/view-all?action=reactivate&inventoryId=' + req.body.inventoryId));
    else
        res.redirect(parse_uri.parse(req, '/admin/inventory/view-all?error=true'));
};

exports.viewEditInventory = async (req, res, next) => {
    const inventory = new Inventory({
        inventoryId: req.params.inventoryId
    });
    const result = await inventory.getInventory();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).render('form/inventory', {
            pageTitle: 'Inventory',
            path: '/admin/inventory/edit',
            query: req.query,
            inventoryData: result
        });
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/inventory/view-all?error=true'));
};

exports.viewCreateInventory = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('form/inventory', {
        pageTitle: 'Inventory',
        path: '/admin/inventory/create',
        query: req.query
    });
};