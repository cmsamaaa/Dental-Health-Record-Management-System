const HTTP_STATUS = require("../constants/http_status");

exports.viewIndex = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('index', {
        path: '/'
    });
};

exports.viewLogin = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('login/login', {
        path: '/login'
    });
};

exports.viewRegister = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('login/register', {
        path: '/register'
    });
};

exports.viewForgotPassword = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('login/forgot-password', {
        path: '/forgot-password'
    });
};

exports.viewInvoice = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('bill/invoice', {
        path: '/invoice'
    });
};

exports.viewInvoicePrint = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('bill/invoice-print', {
        path: '/invoice-print'
    });
};