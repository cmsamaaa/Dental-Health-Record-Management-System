const HTTP_STATUS = require("../constants/http_status");

exports.viewIndex = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('index', {
        pageTitle: 'Index',
        path: '/',
        query: req.query,
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