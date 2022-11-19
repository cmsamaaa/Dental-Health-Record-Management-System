const User = require('../entities/user');

const HTTP_STATUS = require("../constants/http_status");
const _ = require('lodash');

exports.createUser = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const user = new User(req.body);
        const results = await user.createUser();
        console.log(results);

        if (!_.isEmpty(results))
            res.status(HTTP_STATUS.CREATED).json({userId: results[0]});
        else
            res.status(HTTP_STATUS.BAD_REQUEST).json({});
    } else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};

exports.retrieveUser = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const user = new User(req.body);
        const results = await user.authenticateUser();

        if (!_.isEmpty(results))
            res.status(HTTP_STATUS.CREATED).json({userId: results[0].userId});
        else
            res.status(HTTP_STATUS.BAD_REQUEST).json({});
    } else
        res.status(HTTP_STATUS.BAD_REQUEST).json({});
};