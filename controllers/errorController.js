const HTTP_STATUS = require("../constants/http_status");

exports.get404 = (req, res, next) => {
    res.status(HTTP_STATUS.NOT_FOUND).render('error', {
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Page not found'
    });
};