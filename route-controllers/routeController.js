const HTTP_STATUS = require("../constants/http_status");

exports.viewIndex = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('index', {
        pageTitle: 'Index',
        path: '/'
    });
};

exports.viewLogin = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('auth/login', {
        pageTitle: 'Login',
        path: '/login'
    });
};

exports.viewRegister = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('auth/register', {
        pageTitle: 'Register',
        path: '/register'
    });
};

exports.viewForgotPassword = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('auth/forgot-password', {
        pageTitle: 'Forget Password',
        path: '/forgot-password'
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