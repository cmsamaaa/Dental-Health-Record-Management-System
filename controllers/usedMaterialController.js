const _ = require('lodash');
const moment = require('moment');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const UsedMaterial = require("../entities/usedMaterial");

exports.addUsedMaterial = async (req, res, next) => {
    // Get used material data
    const usedMaterial = new UsedMaterial(req.body);
    const usedMaterialData = await usedMaterial.addUsedMaterial();

    res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session'));
};

exports.deleteUsedMaterial = async (req, res, next) => {
    // Delete used material record
    const usedMaterial = new UsedMaterial({ materialId: req.body.materialId });
    const usedMaterialData = await usedMaterial.deleteUsedMaterial();

    res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session'));
};

exports.viewUsedMaterials = async (req, res, next) => {
    const title = 'Inventory';
    const path = '/admin/inventory/history';

    // Get used material data
    const usedMaterial = new UsedMaterial();
    const usedMaterialData = await usedMaterial.getUsedMaterialsByClinicId(req.session.userInfo.clinicId);

    res.status(HTTP_STATUS.OK).render('table/usedMaterials', {
        pageTitle: title,
        path: path,
        query: req.query,
        usedMaterialData: usedMaterialData
    });
};

exports.viewUsedMaterialsReport = async (req, res, next) => {
    const title = 'Inventory Report';
    const path = '/admin/inventory/history/report';

    const usedMaterial = new UsedMaterial();
    let usedMaterialData = [];

    if (req.query.startDate && req.query.endDate) {
        let [day, month, year] = req.query.startDate.split('/');
        const formatStartDate = new Date(+year, month - 1, +day);

        [day, month, year] = req.query.endDate.split('/');
        const formatEndDate = new Date(+year, month - 1, +day);

        usedMaterialData = await usedMaterial.getClinicUsedMaterialsReport(req.session.userInfo.clinicId, formatStartDate, formatEndDate);
    }
    else
        usedMaterialData = await usedMaterial.getClinicUsedMaterialsFullReport(req.session.userInfo.clinicId);

    res.status(HTTP_STATUS.OK).render('report/usedMaterial', {
        pageTitle: title,
        path: path,
        query: req.query,
        usedMaterialData: usedMaterialData
    });
};