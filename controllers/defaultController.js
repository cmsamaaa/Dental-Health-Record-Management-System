const HTTP_STATUS = require("../constants/http_status");

exports.viewIndex = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('index', {
        pageTitle: 'Index',
        path: '/'
    });
};

exports.viewForgotPassword = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('auth/forgot-password', {
        pageTitle: 'Forget Password',
        path: '/forgot-password'
    });
};

exports.view404 = async (req, res, next) => {
    res.status(HTTP_STATUS.NOT_FOUND).render('404', {
        pageTitle: '404',
        path: '/404',
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Page not found'
    });
};