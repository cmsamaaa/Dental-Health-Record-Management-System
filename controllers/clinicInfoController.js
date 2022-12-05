const _ = require('lodash');
const ClinicInfo = require('../entities/clinicInfo');
const parse_uri = require("../lib/parse_uri");

exports.addClinicInfo = async (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        const clinicInfo = new ClinicInfo(req.body);
        const results = await clinicInfo.add();

        if (!_.isEmpty(results))
            res.redirect(parse_uri.parse(req, '/admin/clinic/view-all?create=' + true));
        else
            res.redirect(parse_uri.parse(req, '/admin/clinic/add-information?error=true'));
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/clinic/add-information?error=true'));
};