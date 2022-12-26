const Clinic = require('../entities/clinic');
const HTTP_STATUS = require('../constants/http_status');
const Postal = require('../lib/postal');

const _ = require('lodash');

exports.getAll = async (req, res, next) => {
    const clinic = new Clinic();
    const result = await clinic.getAll();

    res.status(HTTP_STATUS.OK).json(result);
};

exports.getByPostal = async (req, res, next) => {
    const clinic = new Clinic();
    const result = await clinic.getAll();

    if (!_.isEmpty(result)) {
        const postal = req.params.postal;

        if (req.query.type === "district" || !req.query.type) {
            const sectors = Postal.filterByDistrict(postal);

            if (sectors) {
                const filteredResult = _.remove(result, (clinic) => {
                    return _.isEqual(sectors, Postal.filterByDistrict(clinic.clinicPostal));
                });
                res.status(HTTP_STATUS.OK).json(filteredResult);
            }
            else
                res.status(HTTP_STATUS.BAD_REQUEST).json([]);
        }
        else if (req.query.type === "region") {
            const sectors = Postal.filterByRegion(postal);

            if (sectors) {
                const filteredResult = _.remove(result, (clinic) => {
                    return _.isEqual(sectors, Postal.filterByRegion(clinic.clinicPostal));
                });
                res.status(HTTP_STATUS.OK).json(filteredResult);
            }
            else
                res.status(HTTP_STATUS.BAD_REQUEST).json([]);
        }
        else
            res.status(HTTP_STATUS.BAD_REQUEST).json([]);
    }
    else
        res.status(HTTP_STATUS.OK).json(result);
};

exports.getAllDentists = async (req, res, next) => {
    const clinic = new Clinic({
        clinicId: req.params.clinicId
    });
    const result = await clinic.getAllDentists();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).json(result);
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).json({});
};

exports.get = async (req, res, next) => {
    const clinic = new Clinic({
        clinicId: req.params.clinicId
    });
    const result = await clinic.get();

    if (!_.isEmpty(result)) {
        res.status(HTTP_STATUS.OK).json(result);
    }
    else
        res.status(HTTP_STATUS.NOT_FOUND).json({});
};