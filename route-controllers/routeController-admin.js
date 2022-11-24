const HTTP_STATUS = require("../constants/http_status");

exports.viewPatients = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/admin-patients', {
        path: '/admin/patient/view-all'
    });
};

exports.viewAppointments = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/admin-appointments', {
        path: '/admin/appointment/view-all'
    });
};

exports.viewInventory = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/admin-inventory', {
        path: '/admin/inventory/view-all'
    });
};

exports.viewBills = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/admin-bills', {
        path: '/admin/bill/view-all'
    });
};